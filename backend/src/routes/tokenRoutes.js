const express = require("express");
const {
  getAdminToken,
  verifyToken,
  getUserToken,
  getSubadminToken,
} = require("../controller/tokenController");

const router = express.Router();

router.post("/admin", getAdminToken);
router.post("/subadmin", getSubadminToken);
router.post("/user", getUserToken);

router.post("/", verifyToken);

module.exports = router;
