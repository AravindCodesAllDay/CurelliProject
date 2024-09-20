const BestSeller = require("../models/bestsellerModel");
const Products = require("../models/productModel");

async function getBestseller(req, res, next) {
  try {
    const bestsellers = await BestSeller.find();
    res.json(bestsellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addBestseller(req, res, next) {
  const productId = req.params.productId;
  const tag = req.body.tag;
  try {
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingBestSeller = await BestSeller.findOne({ productId });
    if (existingBestSeller) {
      existingBestSeller.tag = tag;
      await existingBestSeller.save();
      return res.status(200).json(existingBestSeller);
    } else {
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
}

module.exports = {
  getBestseller,
  addBestseller,
};
