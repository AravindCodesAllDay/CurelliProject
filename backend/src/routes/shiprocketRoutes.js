const express = require("express");
const router = express.Router();
const {
  createOrder,
  getDeliveryPrice,
  createOrderPrepaid,
  getOrder,
  cancelOrder,
} = require("../services/shiprocketService");

router.post("/create-order", createOrder);
router.post("/create-order-prepaid", createOrderPrepaid);
router.post("/get-delivery", getDeliveryPrice);

router.get("/get-order/:orderId", getOrder);
router.patch("/cancel-order/:orderId", cancelOrder);

module.exports = router;
