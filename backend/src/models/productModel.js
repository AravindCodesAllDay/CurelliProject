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
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["inStock", "noStock", "suspended"],
    default: "inStock",
  },
});

module.exports = mongoose.model("Product", productSchema);
