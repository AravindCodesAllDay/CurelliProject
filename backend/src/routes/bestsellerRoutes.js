const express = require("express");
const {
  getBestseller,
  addBestseller,
} = require("../controller/bestsellerController");

const router = express.Router();

router.get("/", getBestseller);
router.post("/:productId", addBestseller);

module.exports = router;
