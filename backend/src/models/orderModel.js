const mongoose = require("mongoose");
const addressModel = require("./addressModel");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shiprocketId: {
      type: String,
    },
    address: {
      type: addressModel.schema,
      required: true,
    },
    products: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    paymentmethod: {
      type: String,
      enum: ["COD", "Prepaid"],
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: function () {
        return this.paymentmethod === "Prepaid";
      },
    },
    razorpay_order_id: {
      type: String,
      required: function () {
        return this.paymentmethod === "Prepaid";
      },
    },
    razorpay_signature: {
      type: String,
      required: function () {
        return this.paymentmethod === "Prepaid";
      },
    },
    deliveryPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    weight: { type: Number, required: true },
    length: { type: Number, required: true },
    breadth: { type: Number, required: true },
    height: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
