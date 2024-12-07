const crypto = require("crypto");
const Razorpay = require("razorpay");
require("dotenv").config();

const requiredEnvVars = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function verifyPayment(payment_id, order_id, signature) {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    if (signature === expectedSignature) {
      return { verified: true, message: "Payment verified successfully!" };
    } else {
      return { verified: false, message: "Invalid signature!" };
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error.message);
    return { verified: false, message: error.message };
  }
}

async function setPayment(req, res) {
  try {
    const { amount, email } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const options = {
      amount: parseInt(amount) * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
      notes: { email },
    };

    const order = await razorpay.orders.create(options);

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
module.exports = {
  setPayment,
  verifyPayment,
};
