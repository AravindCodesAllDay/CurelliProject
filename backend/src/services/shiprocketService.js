const Orders = require("../models/orderModel");
const User = require("../models/userModel");
const axios = require("axios");
const Razorpay = require("razorpay");

require("dotenv").config();

const requiredEnvVars = [
  "SHIPROCKET_BASE_URL",
  "SHIPROCKET_EMAIL",
  "SHIPROCKET_PASSWORD",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

const BASE_URL = process.env.SHIPROCKET_BASE_URL;
let token = "";

// Helper function to authenticate and manage the token
async function authenticate() {
  if (token) {
    try {
      await axios.get(`${BASE_URL}/settings/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return token;
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("Token expired, re-authenticating...");
      } else {
        console.error("Error validating token:", err.message);
        throw err;
      }
    }
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    token = response.data.token;
    console.log("Authentication successful, new token obtained.");
    return token;
  } catch (error) {
    console.error(
      "Authentication error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function setPayment(req, res) {
  try {
    const { amount, email, contact } = req.body;

    if (!amount || !email || !contact) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const options = {
      amount: parseInt(amount) * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
      notes: { email, contact },
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    res.status(200).json({
      message: "Payment Process initiated",
      order_id: order.id,
    });
  } catch (error) {
    console.error(
      "Error in setPayment:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
      error: error.response?.data || error.message,
    });
  }
}

async function verifyPayment(req, res) {
  const { payment_id, order_id, signature } = req.body;
  const expectedSignature = crypto
    .createHmac("sha256", "your_secret")
    .update(order_id + "|" + payment_id)
    .digest("hex");

  if (signature === expectedSignature) {
    res.status(200).json({ message: "Payment verified successfully!" });
  } else {
    res.status(400).json({ message: "Invalid signature!" });
  }
}

async function getPrimaryAddress() {
  try {
    if (!token) token = await authenticate();

    const response = await axios.get(`${BASE_URL}/settings/company/pickup`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const primaryAddress = response.data?.data?.shipping_address.find(
      (location) => location.is_primary_location === 1
    );

    if (!primaryAddress) throw new Error("No primary pickup location found");
    return primaryAddress;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token expired, re-authenticating...");
      token = await authenticate();
      return getPrimaryAddress();
    }
    console.error("Error fetching primary address:", error.message);
    throw error;
  }
}

function calculateDimensionsAndWeight(cart) {
  return cart.reduce(
    (dimensions, item) => {
      const { productId: product, quantity = 1 } = item;
      dimensions.maxLength = Math.max(
        dimensions.maxLength,
        product.length || 1
      );
      dimensions.maxBreadth = Math.max(
        dimensions.maxBreadth,
        product.breadth || 1
      );
      dimensions.totalHeight += (product.height || 1) * quantity;
      dimensions.totalWeight += (product.weight || 0.1) * quantity;

      return dimensions;
    },
    { maxLength: 0, maxBreadth: 0, totalHeight: 0, totalWeight: 0 }
  );
}

async function calculateDeliveryPrice({
  pickup_postcode,
  delivery_postcode,
  weight,
  cod,
  dimensions,
}) {
  try {
    const { maxLength = 1, maxBreadth = 1, totalHeight = 1 } = dimensions;

    const response = await axios.get(`${BASE_URL}/courier/serviceability/`, {
      params: {
        pickup_postcode,
        delivery_postcode,
        weight,
        cod,
        length: maxLength,
        breadth: maxBreadth,
        height: totalHeight,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data?.available_courier_companies[0]?.rate || 0;
  } catch (error) {
    console.error(
      "Error calculating delivery price:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function getDeliveryPrice(req, res) {
  try {
    const { userId, addressId, COD } = req.body;
    if (!userId || !addressId || !COD) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.address.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const primaryAddress = await getPrimaryAddress();
    const dimensions = calculateDimensionsAndWeight(user.cart);

    const deliveryPrice = await calculateDeliveryPrice({
      pickup_postcode: primaryAddress.pin_code,
      delivery_postcode: address.pincode,
      weight: dimensions.totalWeight,
      cod: COD == "COD" ? 1 : 0,
      dimensions,
    });

    res
      .status(200)
      .json({ message: "Delivery price calculated", deliveryPrice });
  } catch (error) {
    console.error("Error in getDeliveryPrice:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function createOrder(req, res) {
  try {
    const { addressId, userId } = req.body;
    if (!addressId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.address.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (!user.cart.length)
      return res.status(400).json({ message: "Cart is empty" });
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const primaryAddress = await getPrimaryAddress();
    const dimensions = calculateDimensionsAndWeight(user.cart);
    const subtotalPrice = user.cart.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    const deliveryPrice = await calculateDeliveryPrice({
      pickup_postcode: primaryAddress.pin_code,
      delivery_postcode: address.pincode,
      weight: dimensions.totalWeight,
      cod: 1,
      dimensions,
    });

    const totalPrice = subtotalPrice + deliveryPrice;

    const newOrder = new Orders({
      userId,
      address,
      products: user.cart,
      date: new Date().toDateString(),
      paymentmethod: "COD",
      deliveryPrice,
      totalPrice,
      length: dimensions.maxLength,
      breadth: dimensions.maxBreadth,
      height: dimensions.totalHeight,
      weight: dimensions.totalWeight,
    });

    const shiprocketOrder = {
      order_id: newOrder._id.toString(),
      order_date: formatDate(new Date()),
      pickup_location: "Primary",
      channel_id: "",
      company_name: "Curelli",
      billing_customer_name: user.name,
      billing_last_name: "Bot",
      billing_address: address.address,
      billing_address_2: "",
      billing_city: address.district,
      billing_pincode: address.pincode.toString(),
      billing_state: address.state,
      billing_country: address.country || "India",
      billing_email: user.mail,
      billing_phone: user.phone?.toString() || "",
      shipping_is_billing: true,
      order_items: user.cart.map((item) => ({
        name: item.productId.name,
        sku: item.productId.sku || "default_sku",
        units: item.quantity || 1,
        selling_price: item.productId.price || 0,
        discount: "",
        tax: "",
        hsn: item.productId.hsn || 441122,
      })),
      payment_method: "COD",
      shipping_charges: deliveryPrice,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: subtotalPrice,
      length: dimensions.maxLength,
      breadth: dimensions.maxBreadth,
      height: dimensions.totalHeight,
      weight: dimensions.totalWeight,
    };

    const shiprocketResponse = await axios.post(
      `${BASE_URL}/orders/create/adhoc`,
      shiprocketOrder,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!shiprocketResponse.data || shiprocketResponse.data.status_code !== 1) {
      console.error("Shiprocket Response Error:", shiprocketResponse.data);
      return res.status(500).json({
        message: "Failed to create order in Shiprocket",
        error:
          shiprocketResponse.data?.packaging_box_error ||
          shiprocketResponse.data?.message ||
          "Unexpected error occurred",
      });
    }

    newOrder.shiprocketId = shiprocketResponse.data.order_id;

    user.cart = [];
    user.markModified("cart");
    user.orders.push(newOrder._id);

    await newOrder.save();
    await user.save();

    res.status(200).json({
      message: "Order placed successfully",
      order: { id: newOrder._id, totalPrice, deliveryPrice },
    });
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = { createOrder, getDeliveryPrice, setPayment, verifyPayment };
