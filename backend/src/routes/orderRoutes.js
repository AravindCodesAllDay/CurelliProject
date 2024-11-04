const express = require("express");

const {
  getUserOrders,
  getOrders,
  getOrder,
  addOrder,
  changeOrderStatus,
  deleteOrder,
} = require("../controller/orderController");

const router = express.Router();

router.get("/:userId", getUserOrders);
router.get("/", getOrders);
router.get("/:orderId", getOrder);
router.post("/", addOrder);
router.put("/:orderId", changeOrderStatus);
router.delete("/", deleteOrder);

module.exports = router;
