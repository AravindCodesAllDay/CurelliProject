const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.addAdmin = async (req, res) => {
  try {
    const { mail, role } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail) || !role) {
      return res.status(400).json({
        message: "All required fields must be provided and in valid format.",
      });
    }

    const adminExists = await Admin.findOne({ mail });
    if (adminExists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("team@2024", 10);

    const admin = await Admin.create({
      mail,
      pswd: hashedPassword,
      status: role,
    });
    return res.status(201).json(admin);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { mail } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail)) {
      return res
        .status(400)
        .json({ message: "Invalid email format or missing password" });
    }

    let user = await Admin.findOne({ mail });
    let role = user.status;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id, role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.Login = async (req, res) => {
  try {
    const { mail, pswd } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail) || !pswd) {
      return res
        .status(400)
        .json({ message: "Invalid email format or missing password" });
    }

    let user = await Admin.findOne({ mail });
    let role = user.status;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(pswd, user.pswd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, role }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyTokenAdmin = async (req, res) => {
  const { token } = req.body;

  if (!process.env.SECRET_KEY) {
    return res.status(500).json({ message: "Secret key not found" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { role, userId } = decodedToken;

    if (["admin"].includes(role)) {
      console.log(
        `${role.charAt(0).toUpperCase() + role.slice(1)} is authorized`
      );
      return res.status(200).json({
        valid: true,
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } is authorized`,
        userId,
      });
    } else {
      console.log("User is not authorized");
      return res
        .status(403)
        .json({ valid: false, message: "User is not authorized" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ valid: false, error: "Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ valid: false, error: "Invalid token" });
    }

    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ valid: false, error: "Token verification failed" });
  }
};

exports.verifyTokenSubadmin = async (req, res) => {
  const { token } = req.body;

  if (!process.env.SECRET_KEY) {
    return res.status(500).json({ message: "Secret key not found" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { role, userId } = decodedToken;

    if (["subadmin"].includes(role)) {
      console.log(
        `${role.charAt(0).toUpperCase() + role.slice(1)} is authorized`
      );
      return res.status(200).json({
        valid: true,
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } is authorized`,
        userId,
      });
    } else {
      console.log("User is not authorized");
      return res
        .status(403)
        .json({ valid: false, message: "User is not authorized" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ valid: false, error: "Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ valid: false, error: "Invalid token" });
    }

    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ valid: false, error: "Token verification failed" });
  }
};

exports.resetPswdAdmin = async (req, res) => {
  try {
    const { mail, pswd, newpswd } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail)) {
      return res
        .status(400)
        .json({ message: "Invalid email format or missing password" });
    }
    if (newpswd.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    if (!newpswd || newpswd.trim() === "") {
      return res.status(400).json({ message: "New password cannot be empty" });
    }

    const admin = await Admin.findOne({ mail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(pswd, admin.pswd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedNewPswd = await bcrypt.hash(newpswd, 10);
    admin.pswd = hashedNewPswd;

    await admin.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
