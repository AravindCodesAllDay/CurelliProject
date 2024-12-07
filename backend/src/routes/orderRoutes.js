const express = require("express");

const {
  getUserOrders,
  getOrders,
  getOrder,
} = require("../controller/orderController");

const router = express.Router();

router.get("/", getOrders);
router.get("/user", getUserOrders);
router.get("/order/:orderId", getOrder);

module.exports = router;
