const express = require("express");

const {
  getOrders,
  addOrder,
  deleteOrder,
} = require("../controller/orderController");

const router = express.Router();

router.get("/", getOrders);
router.post("/:identifier", addOrder);
router.delete("/:identifier", deleteOrder);

module.exports = router;
