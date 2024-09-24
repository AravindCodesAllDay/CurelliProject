const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

async function getAdmins(req, res) {
  try {
    const admins = await Admin.find({});
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add a new admin
async function addAdmin(req, res) {
  try {
    const { mail } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail)) {
      return res.status(400).json({
        message: "All required fields must be provided and in valid format.",
      });
    }

    const adminExists = await Admin.findOne({ mail });
    if (adminExists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ mail, status: "subadmin" });
    return res.status(201).json(admin);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Admin login
async function adminLogin(req, res) {
  try {
    const { mail, pswd } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail) || !pswd) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const admin = await Admin.findOne({ mail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(pswd, admin.pswd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Reset admin password
async function resetPswdAdmin(req, res) {
  try {
    const { mail, pswd, newpswd } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const admin = await Admin.findOne({ mail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(pswd, admin.pswd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    if (!newpswd || newpswd.trim() === "") {
      return res.status(400).json({ message: "New password cannot be empty" });
    }

    // Hash the new password before saving
    const hashedNewPswd = await bcrypt.hash(newpswd, 10);
    admin.pswd = hashedNewPswd;

    await admin.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getAdmins,
  addAdmin,
  adminLogin,
  resetPswdAdmin,
};
