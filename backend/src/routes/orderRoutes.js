const express = require("express");

const {
  getUserOrders,
  getOrders,
  getOrder,
} = require("../controller/orderController");

const router = express.Router();

router.get("/:userId", getUserOrders);
router.get("/", getOrders);
router.get("/order/:orderId", getOrder);

module.exports = router;
