const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema({
  images: {
    type: [String],
  },
  mobile: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Carousel", carouselSchema);
