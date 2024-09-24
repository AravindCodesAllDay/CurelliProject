const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

exports.Login = async (req, res) => {
  try {
    const { mail, pswd } = req.body;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mailRegex.test(mail) || !pswd) {
      return res
        .status(400)
        .json({ message: "Mail is required or invalid mail format" });
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

    const token = jwt.sign({ id: user._id, role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!process.env.SECRET_KEY) {
      return res.status(500).json({ message: "Secret key not found" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { role, userId } = decodedToken;

    if (["admin", "subadmin", "user"].includes(role)) {
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
    console.error("Token verification failed:", error);
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
};
