const BestSeller = require("../models/bestsellerModel");
const Products = require("../models/productModel");

async function getBestseller(req, res, next) {
  try {
    const bestsellers = await BestSeller.find().populate({
      path: "products.productId",
      select: "name rating photos description price status ratingcount",
    });

    const inStockProducts =
      bestsellers.length > 0
        ? bestsellers[0].products
            .filter((item) => item.productId.status === "inStock")
            .map((item) => ({
              productId: item.productId._id,
              name: item.productId.name,
              rating: item.productId.rating,
              photos: item.productId.photos,
              description: item.productId.description,
              price: item.productId.price,
              status: item.productId.status,
              ratingcount: item.productId.ratingcount,
              tag: item.tag,
            }))
        : [];

    res.json(inStockProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addBestseller(req, res, next) {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "All values must be provided" });
    }

    const foundProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Products.findById(item.productId);
        if (!product) {
          return null;
        }
        return item;
      })
    );

    const validProducts = foundProducts.filter((item) => item !== null);

    if (validProducts.length === 0) {
      return res.status(404).json({ message: "No valid products found" });
    }
    await BestSeller.deleteMany();
    const bestseller = new BestSeller({ products: validProducts });
    await bestseller.save();

    res
      .status(201)
      .json({ message: "Bestseller added successfully", bestseller });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getBestseller,
  addBestseller,
};
