const User = require("../models/userModel");
const Products = require("../models/productModel");

exports.addCart = async (req, res) => {
  try {
    const { userId, product } = req.body;
    if (!userId || !product) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const productData = await Products.findById(product);
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cartItem = {
      _id: productData._id,
      name: productData.name,
      price: productData.price,
      photo: productData.photo,
      stock: productData.stock,
      quantity: 1,
    };

    user.cart.push(cartItem);
    await user.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.removeCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCartItemIndex = user.cart.findIndex(
      (item) => item._id.toString() === productId
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
};

exports.cartQuantity = async (req, res) => {
  try {
    const { userId, productId, sign } = req.body;
    if (!userId || !productId || !sign || (sign !== "+" && sign !== "-")) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCartIndex = user.cart.findIndex(
      (item) => item._id.toString() === productId
    );
    if (existingCartIndex !== -1) {
      const existingCartItem = user.cart[existingCartIndex];
      if (sign === "-") {
        if (existingCartItem.quantity > 1) {
          existingCartItem.quantity -= 1;
          user.cart.splice(existingCartIndex, 1);
          user.cart.push(existingCartItem);
        } else {
          return res
            .status(401)
            .json({ message: "Cart quantity cannot be zero...!" });
        }
      } else {
        console.log(existingCartItem);
        existingCartItem.quantity += 1;
        user.cart.splice(existingCartIndex, 1);
        user.cart.push(existingCartItem);
      }
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Cart quantity updated successfully" });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = await User.findById(identifier);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    user.cart = [];
    await user.save();

    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
