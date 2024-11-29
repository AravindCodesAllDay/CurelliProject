const Orders = require("../models/orderModel");
const User = require("../models/userModel");

async function getUserOrders(req, res, next) {
  try {
    const { userId } = req.params;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Orders.find({ userId }).populate({
      path: "products.productId",
      model: "Product",
    });

    const groupedOrders = {
      pending: orders.filter((order) => order.orderStatus === "pending"),
      delivered: orders.filter((order) => order.orderStatus === "delivered"),
      cancelled: orders.filter((order) => order.orderStatus === "cancelled"),
    };

    return res.status(200).json(groupedOrders);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await Orders.find({}).populate({
      path: "products.productId",
      model: "Product",
    });

    const groupedOrders = {
      pending: orders.filter((order) => order.orderStatus === "pending"),
      delivered: orders.filter((order) => order.orderStatus === "delivered"),
      cancelled: orders.filter((order) => order.orderStatus === "cancelled"),
    };

    return res.status(200).json(groupedOrders);
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
    const order = await Orders.findById(orderId).populate({
      path: "products.productId",
      model: "Product",
    });
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function addOrder(req, res, next) {
  try {
    const {
      addressId,
      paymentmethod,
      totalPrice,
      userId,
      weight,
      length,
      breadth,
      height,
    } = req.body;
    const d = new Date();

    if (
      !totalPrice ||
      !addressId ||
      !paymentmethod ||
      !userId ||
      !weight ||
      !length ||
      !breadth ||
      !height
    ) {
      return res.status(400).send("Missing required fields");
    }
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.address.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const products = user.cart;
    if (!products.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Orders({
      userId,
      address,
      products,
      date: d.toDateString(),
      paymentmethod,
      weight,
      length,
      breadth,
      height,
      totalPrice,
    });

    user.cart = [];
    user.orders.push(newOrder._id);

    await newOrder.save();
    await user.save();

    return res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteOrder(req, res, next) {
  try {
    const { OrderId: orderId, userId } = req.body;

    const user = await User.findById(userId);
    const order = await Orders.findById(orderId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orderIndex = order.cart.findIndex((item) => item.product === product);

    if (orderIndex !== -1) {
      order.cart.splice(orderIndex, 1);
    }

    await order.save();

    return res
      .status(200)
      .json({ message: "Product deleted from cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and new status are required." });
    }

    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getUserOrders,
  getOrders,
  getOrder,
  addOrder,
  updateStatus,
  deleteOrder,
};
