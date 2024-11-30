// routes/shiprocket.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getDeliveryPrice,
  setPayment,
  verifyPayment,
} = require("../services/shiprocketService");

router.post("/create-order", createOrder);
router.post("/get-delivery", getDeliveryPrice);

router.post("/create-payment", setPayment);
router.post("/verify-payment", verifyPayment);

module.exports = router;
