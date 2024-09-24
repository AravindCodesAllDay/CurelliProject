const User = require("../models/userModel");
const Products = require("../models/productModel");

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cart
      .filter((item) => item.productId.status === "inStock")
      .map((item) => {
        const product = item.productId;
        return {
          productId: product._id,
          name: product.name,
          photos: product.photos,
          price: product.price,
          quantity: item.quantity,
        };
      });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

    const productData = await Products.findById(productId);
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
};

exports.cartQuantity = async (req, res) => {
  try {
    const { sign } = req.params;
    const { userId, productId } = req.body;

    if (!userId || !productId || !sign || (sign !== "+" && sign !== "-")) {
      return res.status(400).json({ message: "Invalid request" });
    }

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
};

exports.emptyCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }
    const user = await User.findById(userId);

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
