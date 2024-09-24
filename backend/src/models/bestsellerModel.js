const mongoose = require("mongoose");

const bestsellerSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bestseller", bestsellerSchema);
