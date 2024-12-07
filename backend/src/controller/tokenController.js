const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key_here";

async function createToken(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const payload = { userId };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "14d" });

  return token;
}

async function verifyToken(token) {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

async function verifyTokenApi(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.status(200).json({ userId: decoded.userId });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  createToken,
  verifyToken,
  verifyTokenApi,
};
