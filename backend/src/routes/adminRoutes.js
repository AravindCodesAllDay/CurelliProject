const express = require("express");
const {
  addAdmin,
  getAdmins,
  resetPswdAdmin,
  adminLogin,
} = require("../controller/adminController");

const router = express.Router();

router.get("/", getAdmins);
router.post("/", addAdmin);
router.put("/", resetPswdAdmin);
router.post("/login", adminLogin);

module.exports = router;
