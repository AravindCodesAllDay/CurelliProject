const express = require("express");
const {
  getSubadmins,
  addSubadmin,
  resetPswdSubadmin,
  subadminLogin,
  removeSubadmin,
} = require("../controller/subadminController");

const router = express.Router();

router.get("/", getSubadmins);
router.post("/", addSubadmin);
router.put("/", resetPswdSubadmin);
router.put("/delete", removeSubadmin);
router.post("/login", subadminLogin);

module.exports = router;
