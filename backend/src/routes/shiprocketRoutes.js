// routes/shiprocket.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getDeliveryPrice,
  setPayment,
  createOrderPrepaid,
  getOrder,
  cancelOrder,
} = require("../services/shiprocketService");

router.post("/create-order", createOrder);
router.post("/create-order-prepaid", createOrderPrepaid);
router.post("/get-delivery", getDeliveryPrice);

router.post("/create-payment", setPayment);

router.get("/get-order/:userId/:orderId", getOrder);
router.patch("/cancel-order/:userId/:orderId", cancelOrder);

module.exports = router;
