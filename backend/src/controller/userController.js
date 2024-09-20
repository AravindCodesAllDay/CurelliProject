const User = require("../models/userModel");
const Products = require("../models/productModel");
const Wishlist = require("../models/wishlistModel");
const Address = require("../models/addressModel");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 587,
  secure: false,
  auth: {
    user: "contact@curellifoods.com",
    pass: "Curellifoods@2023",
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: "contact@curellifoods.com",
    to: email,
    subject: "Verification from Curelli",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.googleLogin = async (req, res) => {
  try {
    const { name, mail } = req.body;
    if (!name || !mail) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }
    const newUser = { name, mail };
    const user = await User.create(newUser);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(pswd, 10);
    const newUser = { name, mail, phone, pswd: hashedPassword };
    const user = await User.create(newUser);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { identifier } = req.params;
    let user = mongoose.Types.ObjectId.isValid(identifier)
      ? await User.findOne({ _id: identifier })
      : await User.findOne({ mail: identifier });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
