const express = require("express");

const Orders = require("../models/orderModel");
const User = require("../models/userModel");

const router = express.Router();

router.post("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const { addressId, products, paymentmethod, totalPrice } = req.body;
    const d = new Date();

    let user = await User.findById(identifier);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    // Create new order
    const newOrder = new Orders({
      userId: identifier,
      address: addressId,
      products: products,
      date: d.toDateString(),
      paymentmethod: paymentmethod,
      paymentDone: "pending",
      delivered: false,
      totalPrice: totalPrice,
    });
    console.log(newOrder);
    // Add new order to the user's orders array
    user.orders.push(newOrder);

    // Save the user and the order
    await newOrder.save();
    await user.save();

    return res.status(200).json(newOrder);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Orders.find({});

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const { OrderId } = req.body;

    const user = await User.findById(identifier);
    const order = await Orders.findById(OrderId);

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
});

module.exports = router;
