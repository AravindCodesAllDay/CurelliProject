const express = require("express");

const {
  getUserOrders,
  getOrders,
  getOrder,
  addOrder,
  updateStatus,
  deleteOrder,
} = require("../controller/orderController");

const router = express.Router();

router.get("/:userId", getUserOrders);
router.get("/", getOrders);
router.get("/:orderId", getOrder);
router.post("/", addOrder);
router.patch("/:orderId", updateStatus);
router.delete("/", deleteOrder);

module.exports = router;
