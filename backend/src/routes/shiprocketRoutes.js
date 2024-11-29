// routes/shiprocket.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getDeliveryPrice,
} = require("../services/shiprocketService");

router.post("/create-order", createOrder);
router.post("/get-delivery", getDeliveryPrice);
// router.get("/get-token", getDeliveryPrice);

module.exports = router;
