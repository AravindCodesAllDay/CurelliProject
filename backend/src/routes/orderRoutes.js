const express = require("express");

const {
  getOrders,
  addOrder,
  deleteOrder,
  getUserOrders,
} = require("../controller/orderController");

const router = express.Router();

router.get("/:userId", getUserOrders);
router.get("/", getOrders);
router.post("/", addOrder);
router.delete("/", deleteOrder);

module.exports = router;
