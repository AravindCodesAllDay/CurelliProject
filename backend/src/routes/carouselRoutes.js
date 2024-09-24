const express = require("express");
const multer = require("multer");
const {
  getCarousel,
  addCarousel,
} = require("../controller/carouselController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getCarousel);
router.post(
  "/",
  upload.fields([{ name: "images", maxCount: 10 }]),
  addCarousel
);

module.exports = router;
