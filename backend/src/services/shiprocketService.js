const Orders = require("../models/orderModel");
const User = require("../models/userModel");
const axios = require("axios");
const { verifyPayment } = require("./razorpayService");
const { verifyToken } = require("../controller/tokenController");

require("dotenv").config();

const requiredEnvVars = [
  "SHIPROCKET_BASE_URL",
  "SHIPROCKET_EMAIL",
  "SHIPROCKET_PASSWORD",
];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

const BASE_URL = process.env.SHIPROCKET_BASE_URL;
let token = "";

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
      dimensions.totalWeight += ((product.weight || 0.1) * quantity) / 1000;

      return dimensions;
    },
    { maxLength: 0, maxBreadth: 0, totalHeight: 0, totalWeight: 0 }
  );
}

async function calculateDeliveryPrice({
  pickup_postcode,
  delivery_postcode,
  cod,
  dimensions,
}) {
  try {
    const {
      maxLength = 1,
      maxBreadth = 1,
      totalHeight = 1,
      totalWeight = 1,
    } = dimensions;

    const response = await axios.get(`${BASE_URL}/courier/serviceability/`, {
      params: {
        pickup_postcode,
        delivery_postcode,
        weight: totalWeight,
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
    const { addressId, COD } = req.body;
    const authHeader = req.headers.authorization;

    if (!addressId || !COD) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const customToken = authHeader.split(" ")[1];

    const userId = await verifyToken(customToken);
    const user = await User.findById(userId).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.address.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const primaryAddress = await getPrimaryAddress();
    const dimensions = calculateDimensionsAndWeight(user.cart);

    const deliveryPrice = await calculateDeliveryPrice({
      pickup_postcode: primaryAddress.pin_code,
      delivery_postcode: address.pincode,
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
    const { addressId } = req.body;
    const authHeader = req.headers.authorization;
    if (!addressId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const customToken = authHeader.split(" ")[1];

    const userId = await verifyToken(customToken);

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
      cod: 1,
      dimensions,
    });

    const newOrder = new Orders({
      userId,
      address,
      products: user.cart,
      date: new Date().toDateString(),
      paymentmethod: "COD",
      deliveryPrice,
      subtotalPrice,
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
      billing_last_name: "",
      billing_address: address.address,
      billing_address_2: "",
      billing_city: address.district,
      billing_pincode: address.pincode.toString(),
      billing_state: address.state,
      billing_country: address.country || "India",
      billing_email: user.mail,
      billing_phone: address.addressContact?.toString() || "",
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
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
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
      order: { id: newOrder._id, subtotalPrice, deliveryPrice },
    });
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function createOrderPrepaid(req, res) {
  try {
    const {
      addressId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;
    if (
      !addressId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const authHeader = req.headers.authorization;
    const verificationResult = await verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );
    if (!verificationResult.verified) {
      return res.status(400).json({ message: verificationResult.message });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const customToken = authHeader.split(" ")[1];

    const userId = await verifyToken(customToken);
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
      cod: 0,
      dimensions,
    });

    const newOrder = new Orders({
      userId,
      address,
      products: user.cart,
      date: new Date().toDateString(),
      paymentmethod: "Prepaid",
      deliveryPrice,
      subtotalPrice,
      length: dimensions.maxLength,
      breadth: dimensions.maxBreadth,
      height: dimensions.totalHeight,
      weight: dimensions.totalWeight,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    const shiprocketOrder = {
      order_id: newOrder._id.toString(),
      order_date: formatDate(new Date()),
      pickup_location: "Primary",
      channel_id: "",
      company_name: "Curelli",
      billing_customer_name: user.name,
      billing_last_name: "",
      billing_address: address.address,
      billing_address_2: "",
      billing_city: address.district,
      billing_pincode: address.pincode.toString(),
      billing_state: address.state,
      billing_country: address.country || "India",
      billing_email: user.mail,
      billing_phone: address.addressContact?.toString() || "",
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
      payment_method: "Prepaid",
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
      order: { id: newOrder._id, subtotalPrice, deliveryPrice },
    });
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Invalid format or missing parameters." });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const customToken = authHeader.split(" ")[1];
    const userId = await verifyToken(customToken);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User or order not found." });
    }

    const order = await Orders.findById(orderId)
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const transformedOrder = {
      ...order,
      products: order.products.map((item) => ({
        ...item.productId,
        quantity: item.quantity,
      })),
    };

    if (!token) {
      token = await authenticate();
    }

    const { status, trackingData, deliveryDate } =
      await fetchShiprocketOrderAndTracking(order.shiprocketId);

    return res.status(200).json({
      order: transformedOrder,
      status,
      trackingData,
      deliveryDate,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token expired, re-authenticating...");
      token = await authenticate();
      return getOrder(req, res, next);
    }

    console.error("Error in getOrder:", error.message);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
}

async function fetchShiprocketOrderAndTracking(shiprocketId) {
  try {
    const orderResponse = await axios.get(
      `${BASE_URL}/orders/show/${shiprocketId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const orderData = orderResponse.data.data;
    const status = orderData.status;

    const deliveryDate =
      orderData.expected_delivery_date || orderData.delivered_at || null;

    const trackingResponse = await axios.get(`${BASE_URL}/courier/track`, {
      params: {
        order_id: shiprocketId,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const trackingData = trackingResponse.data;

    return { status, trackingData, deliveryDate };
  } catch (error) {
    console.error(
      "Error fetching product status, tracking data, or delivery date from Shiprocket:",
      error.message
    );
    throw error;
  }
}

async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Invalid format or missing parameters." });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const customToken = authHeader.split(" ")[1];
    const userId = await verifyToken(customToken);
    const order = await Orders.findOne({ _id: orderId, userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or does not belong to this user." });
    }

    if (!token) {
      token = await authenticate();
    }

    const response = await axios.post(
      `${BASE_URL}/orders/cancel`,
      {},
      {
        params: { ids: [order.shiprocketId] },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.status(200).json({
      message: "Order cancelled successfully.",
      shiprocketResponse: response.data,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token expired, re-authenticating...");
      token = await authenticate();
      return router.handle(req, res);
    }

    console.error("Error cancelling Shiprocket order:", error.message);
    return res
      .status(500)
      .json({ message: "An unexpected error occurred.", error: error.message });
  }
}

module.exports = {
  createOrder,
  createOrderPrepaid,
  getDeliveryPrice,
  getOrder,
  cancelOrder,
};
