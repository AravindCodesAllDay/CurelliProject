const User = require("../models/userModel");
const Product = require("../models/productModel");

const { verifyToken } = require("./tokenController");

async function getCart(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cart
      .filter((item) => item.productId && item.productId.status === "inStock")
      .map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        photos: item.productId.photos,
        price: item.productId.price,
        quantity: item.quantity,
      }));

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addCart(req, res) {
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isInCart = user.cart.some(
      (item) => item.productId.toString() === productId
    );

    if (isInCart) {
      return res.status(409).json({ message: "Item already in cart" });
    }

    const productData = await Product.findById(productId);
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cartItem = { productId: productData._id };

    user.cart.push(cartItem);
    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function removeCart(req, res) {
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItemIndex !== -1) {
      user.cart.splice(existingCartItemIndex, 1);
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Product deleted from cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function cartQuantity(req, res) {
  try {
    const { productId, sign } = req.params;

    if (!productId || !sign || (sign !== "+" && sign !== "-")) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (!existingCartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (sign === "-") {
      if (existingCartItem.quantity > 1) {
        existingCartItem.quantity -= 1;
      } else {
        return res
          .status(400)
          .json({ message: "Cart quantity cannot be less than one" });
      }
    } else if (sign === "+") {
      existingCartItem.quantity += 1;
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Cart quantity updated", cart: user.cart });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getCart,
  addCart,
  removeCart,
  cartQuantity,
};
