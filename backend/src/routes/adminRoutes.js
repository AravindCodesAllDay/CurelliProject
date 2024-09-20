const express = require("express");
const {
  addAdmin,
  getAdmins,
  resetPswdAdmin,
  adminLogin,
  getToken,
  verifyToken,
} = require("../controller/adminController");

const router = express.Router();

router.get("/", getAdmins);
router.post("/", addAdmin);
router.put("/", resetPswdAdmin);
router.post("/login", adminLogin);

router.get("/verify/:token", verifyToken);
router.post("/token", getToken);

module.exports = router;
