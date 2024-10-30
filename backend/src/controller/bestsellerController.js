const Bestseller = require("../models/bestsellerModel");
const Product = require("../models/productModel");

async function getBestseller(req, res) {
  try {
    const bestsellers = await Bestseller.find().populate({
      path: "productId",
      select: "name rating photos description price status ratingcount",
    });

    const inStockProducts = bestsellers
      .filter((item) => item.productId && item.productId.status === "inStock")
      .map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        rating: item.productId.rating,
        photos: item.productId.photos,
        description: item.productId.description,
        price: item.productId.price,
        ratingcount: item.productId.ratingcount,
        tag: item.tag,
      }));

    res.json(inStockProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addBestseller(req, res) {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "All values must be provided" });
    }

    const validProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        return product ? item : null;
      })
    );

    const filteredProducts = validProducts.filter((item) => item !== null);

    if (filteredProducts.length === 0) {
      return res.status(404).json({ message: "No valid products found" });
    }

    await Bestseller.deleteMany();
    const bestsellers = filteredProducts.map(
      (item) => new Bestseller({ productId: item.productId, tag: item.tag })
    );
    await Bestseller.insertMany(bestsellers);

    res.status(201).json({
      message: "Bestseller added successfully",
      bestsellers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getBestseller,
  addBestseller,
};
