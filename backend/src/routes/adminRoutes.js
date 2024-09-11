const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, pswd } = req.body;
    if (!name || !pswd) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    const hashedPassword = await bcrypt.hash(pswd, 10);

    const newAdmin = {
      name: name,
      pswd: hashedPassword,
    };
    const admin = await Admin.create(newAdmin);
    return res.status(200).json(admin);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    let admin = await Admin.findOne({ name: "admin" });
    return res.status(200).json({ subusers: admin.subusers });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/addsubadmin", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format.",
      });
    }
    let admin = await Admin.findOne({ name: "admin" });

    if (admin.subusers.includes(email)) {
      return res.status(400).json({
        message: "Email is already present in sub-users list.",
      });
    }

    admin.subusers.push(email);
    await admin.save();
    return res.status(200).send("subadmin added");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/removesubadmin", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email must be provided.",
      });
    }

    const admin = await Admin.findOne({ name: "admin" });
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found.",
      });
    }

    if (!admin.subusers.includes(email)) {
      return res.status(400).json({
        message: "Email not found in sub-users list.",
      });
    }

    admin.subusers = admin.subusers.filter((subuser) => subuser !== email);
    await admin.save();

    return res.status(200).json({
      message: "Sub-admin removed successfully.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Using the secretKey from environment variables
    const userId = decodedToken.username;

    if (userId == "admin") {
      console.log("User is authorized");
      return res
        .status(200)
        .json({ valid: true, message: "User is authorized" });
    } else {
      console.log("User is not authorized");
      return res
        .status(403)
        .json({ valid: false, message: "User is not authorized" });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
});

router.post("/logintoken", async (req, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign({ username: "admin" }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log("Token Generated");
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
