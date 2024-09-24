const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { name, mail } = req.body;
    if (!name || !mail) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }
    let user = await User.findOne({ mail });
    if (user) {
      return res.status(200).json(user);
    }
    user = await User.create({ name, mail });
    return res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { pswd, mail } = req.body;
    if (!pswd || !mail) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordsMatch = await bcrypt.compare(pswd, user.pswd);
    if (!passwordsMatch) {
      return res.status(400).json({ message: "Password doesn't match" });
    }
    return res.status(200).json(user); // 200 for successful login
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.changePswd = async (req, res) => {
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
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
