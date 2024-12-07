const Orders = require("../models/orderModel");
const User = require("../models/userModel");

const { verifyToken } = require("./tokenController");

async function getOrders(req, res, next) {
  try {
    const orders = await Orders.find({})
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .lean();

    const transformedOrders = orders.map((order) => ({
      ...order,
      products: order.products.map((item) => ({
        ...item.productId,
        quantity: item.quantity,
      })),
    }));

    return res.status(200).json(transformedOrders);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}
async function getUserOrders(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Orders.find({ userId })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .lean();

    const transformedOrders = orders.map((order) => ({
      ...order,
      products: order.products.map((item) => ({
        ...item.productId,
        quantity: item.quantity,
      })),
    }));

    return res.status(200).json(transformedOrders.reverse());
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}
async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Invalid format or missing parameters" });
    }

    const order = await Orders.findById(orderId)
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const transformedOrder = {
      ...order,
      products: order.products.map((item) => ({
        ...item.productId,
        quantity: item.quantity,
      })),
    };

    return res.status(200).json(transformedOrder);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getUserOrders,
  getOrders,
  getOrder,
};
