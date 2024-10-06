const mongoose = require("mongoose");
const addressModel = require("./addressModel");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      enum: ["cash", "upi"],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
