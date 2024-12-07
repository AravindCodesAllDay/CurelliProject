const express = require("express");
const { verifyTokenApi } = require("../controller/tokenController");

const router = express.Router();

router.get("/", verifyTokenApi);

module.exports = router;
