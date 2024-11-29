const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  ratingcount: {
    type: Number,
  },
  photos: {
    type: [String],
  },
  sku: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  length: { type: Number, required: true },
  breadth: { type: Number, required: true },
  height: { type: Number, required: true },
  status: {
    type: String,
    enum: ["inStock", "noStock", "Suspended"],
    default: "inStock",
  },
});

module.exports = mongoose.model("Product", productSchema);
