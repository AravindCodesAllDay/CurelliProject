// routes/shiprocket.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getDeliveryPrice,
  setPayment,
  verifyPayment,
  createOrderPrepaid,
} = require("../services/shiprocketService");

router.post("/create-order", createOrder);
router.post("/create-order-prepaid", createOrderPrepaid);
router.post("/get-delivery", getDeliveryPrice);

router.post("/create-payment", setPayment);

module.exports = router;
