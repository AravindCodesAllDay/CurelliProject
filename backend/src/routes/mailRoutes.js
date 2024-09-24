const express = require("express");

const { sendMail } = require("../controller/mailController");

const router = express.Router();

router.post("/sendOTP", sendMail);

module.exports = router;
