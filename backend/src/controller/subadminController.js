const bcrypt = require("bcrypt");
const Subadmin = require("../models/subadminModel");

async function getSubadmins(req, res) {
  try {
    const subadmins = await Subadmin.find({});
    return res.status(200).json(subadmins);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function addSubadmin(req, res) {
  try {
    const { mail } = req.body;

    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail || !mailRegex.test(mail)) {
      return res
        .status(400)
        .json({ message: "mailId required or invalid mail format" });
    }

    const subadminFind = await Subadmin.findOne({ mail });
    if (subadminFind) {
      return res.status(409).json({ message: "Subadmin already exists" });
    }

    const subadmin = await Subadmin.create({ mail });
    return res.status(201).json(subadmin);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function subadminLogin(req, res) {
  try {
    const { mail, pswd } = req.body;

    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail || !mailRegex.test(mail)) {
      return res
        .status(400)
        .json({ message: "mailId required or invalid mail format" });
    }

    const subadmin = await Subadmin.findOne({ mail });
    if (!subadmin) {
      return res.status(404).json({ message: "Subadmin not found" });
    }

    const isMatch = await bcrypt.compare(pswd, subadmin.pswd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function resetPswdSubadmin(req, res) {
  try {
    const { mail, pswd, newpswd } = req.body;

    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail || !mailRegex.test(mail)) {
      return res
        .status(400)
        .json({ message: "mailId required or invalid mail format" });
    }

    const subadmin = await Subadmin.findOne({ mail });
    if (!subadmin) {
      return res.status(404).json({ message: "Subadmin not found" });
    }

    const isMatch = await bcrypt.compare(pswd, subadmin.pswd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!newpswd || newpswd.trim() === "") {
      return res.status(400).json({ message: "New password cannot be empty" });
    }

    // Hash the new password before saving
    const hashedNewPswd = await bcrypt.hash(newpswd, 10);
    subadmin.pswd = hashedNewPswd;

    await subadmin.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function removeSubadmin(req, res) {
  try {
    const { mail } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail || !mailRegex.test(mail)) {
      return res.status(400).json({
        message: "Email must be provided.",
      });
    }

    const subadmin = await Subadmin.deleteOne({ mail });
    if (subadmin.deletedCount === 0) {
      return res.status(404).json({
        message: "Subadmin not found.",
      });
    }

    return res.status(200).json({
      message: "Subadmin removed successfully.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getSubadmins,
  addSubadmin,
  subadminLogin,
  resetPswdSubadmin,
  removeSubadmin,
};
