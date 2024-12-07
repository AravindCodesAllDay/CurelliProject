const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { createToken, verifyToken } = require("./tokenController");

async function getUser(req, res) {
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

    const userResponse = {
      ...user.toObject(),
      cart: cartItems,
    };

    return res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error in getUser:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function googleLogin(req, res) {
  try {
    const { name, mail } = req.body;

    if (!name || !mail) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    let user = await User.findOne({ mail });
    if (user) {
      const token = await createToken(user._id);
      return res.status(200).json({ token, name });
    }

    user = await User.create({ name, mail, isgoogle: true });
    const token = await createToken(user._id);

    return res.status(201).json({ token, name });
  } catch (error) {
    console.error("Error in googleLogin:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function login(req, res) {
  try {
    const { pswd, mail } = req.body;

    if (!pswd || !mail) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isgoogle) {
      return res.status(403).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    const passwordsMatch = await bcrypt.compare(pswd, user.pswd);
    if (!passwordsMatch) {
      return res.status(400).json({ message: "Password doesn't match." });
    }

    const token = await createToken(user._id);

    return res.status(200).json({ token, name: user.name });
  } catch (error) {
    console.error("Error in login:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function register(req, res) {
  try {
    const { name, mail, phone, pswd } = req.body;

    if (!name || !mail || !phone || !pswd) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(pswd, 10);

    const newUser = new User({
      name,
      mail,
      phone,
      isgoogle: false,
      pswd: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in register:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function changePswd(req, res) {
  try {
    const { newPswd, userId } = req.body;

    if (!newPswd || !userId) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPswd, 10);
    user.pswd = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePswd:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { getUser, googleLogin, login, register, changePswd };
