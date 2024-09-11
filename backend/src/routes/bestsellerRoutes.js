const express = require("express");

const BestSeller = require("../models/bestsellerModel");
const Products = require("../models/productModel");

const router = express.Router();

router.post("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const tag = req.body.tag; // Assuming tag is sent in the request body
  try {
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already a bestseller
    const existingBestSeller = await BestSeller.findOne({ productId });
    if (existingBestSeller) {
      // If the product is already a bestseller, update the tags
      existingBestSeller.tag = tag;
      await existingBestSeller.save();
      return res.status(200).json(existingBestSeller);
    } else {
      // If the product is not a bestseller, create a new entry
      const newBestSeller = new BestSeller({
        productId: productId,
        tag: tag,
      });
      const bestSeller = await newBestSeller.save();
      return res.status(200).json(bestSeller);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const bestsellers = await BestSeller.find();
    res.json(bestsellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
