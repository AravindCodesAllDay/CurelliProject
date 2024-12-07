const Product = require("../models/productModel");
const User = require("../models/userModel");
const { verifyToken } = require("../controller/tokenController");

async function getWishlist(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId).populate({
      path: "wishlist",
      select: "name rating ratingcount photos price status",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlistItems = user.wishlist
      .filter((item) => item.status !== "suspended")
      .map((product) => ({
        productId: product._id,
        name: product.name,
        rating: product.rating,
        ratingcount: product.ratingcount,
        photos: product.photos,
        price: product.price,
      }));

    return res.status(200).json(wishlistItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add to Wishlist
async function addWishlist(req, res) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    const isInWishlist = user.wishlist.some(
      (item) => item.toString() === productId
    );

    if (isInWishlist) {
      return res.status(409).json({ message: "Item already in wishlist" });
    }

    const productData = await Product.findById(productId);
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }

    user.wishlist.push(productId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Remove from Wishlist
async function removeWishlist(req, res) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingWishlistItemIndex = user.wishlist.findIndex(
      (item) => item.toString() === productId
    );

    if (existingWishlistItemIndex !== -1) {
      user.wishlist.splice(existingWishlistItemIndex, 1);
    } else {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    await user.save();
    return res
      .status(200)
      .json({ message: "Product deleted from wishlist successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getWishlist,
  addWishlist,
  removeWishlist,
};
