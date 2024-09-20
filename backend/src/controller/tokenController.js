const jwt = require("jsonwebtoken");

// Generate JWT token based on role
async function generateToken(req, res, role) {
  try {
    if (!process.env.SECRET_KEY) {
      return res.status(500).json({ message: "Secret key not found" });
    }

    const token = jwt.sign({ username: role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    console.log(`Token Generated for ${role}`);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Handlers to generate tokens for different roles
async function getAdminToken(req, res) {
  return generateToken(req, res, "admin");
}

async function getSubadminToken(req, res) {
  return generateToken(req, res, "subadmin");
}

async function getUserToken(req, res) {
  return generateToken(req, res, "user");
}

// Verify JWT token and authorize based on role
async function verifyToken(req, res) {
  try {
    const { token } = req.params;

    if (!process.env.SECRET_KEY) {
      return res.status(500).json({ message: "Secret key not found" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const role = decodedToken.username;

    if (["admin", "subadmin", "user"].includes(role)) {
      console.log(
        `${role.charAt(0).toUpperCase() + role.slice(1)} is authorized`
      );
      return res.status(200).json({
        valid: true,
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } is authorized`,
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
}

module.exports = { getAdminToken, getSubadminToken, getUserToken, verifyToken };
