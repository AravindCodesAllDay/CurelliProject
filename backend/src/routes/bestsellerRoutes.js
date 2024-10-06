const express = require("express");
const {
  getBestseller,
  addBestseller,
} = require("../controller/bestsellerController");

const router = express.Router();

router.get("/", getBestseller);
router.post("/", addBestseller);

module.exports = router;
