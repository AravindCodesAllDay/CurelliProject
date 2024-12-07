const express = require("express");
const router = express.Router();
const { setPayment } = require("../services/razorpayService");

router.post("/create-payment", setPayment);

module.exports = router;
