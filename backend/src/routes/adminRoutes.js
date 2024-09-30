const express = require("express");
const {
  addAdmin,
  getAdmins,
  resetPswdAdmin,
  Login,
  googleLogin,
  verifyTokenAdmin,
  verifyTokenSubadmin,
} = require("../controller/adminController");

const router = express.Router();

router.get("/", getAdmins);
router.post("/", addAdmin);
router.post("/google", googleLogin);
router.post("/login", Login);
router.post("/admin", verifyTokenAdmin);
router.post("/subadmin", verifyTokenSubadmin);
router.put("/", resetPswdAdmin);

module.exports = router;
