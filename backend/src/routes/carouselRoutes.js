const express = require("express");
const multer = require("multer");
const {
  getCarousel,
  addCarousel,
} = require("../controller/carouselController");

const router = express.Router();

const carouselUpload = multer({ storage: multer.memoryStorage() });

router.get("/", getCarousel);

router.post(
  "/",
  carouselUpload.fields([
    { name: "carouselImage1", maxCount: 1 },
    { name: "carouselImage2", maxCount: 1 },
    { name: "carouselImage3", maxCount: 1 },
    { name: "carouselImage4", maxCount: 1 },
    { name: "mobileCarouselImage1", maxCount: 1 },
    { name: "mobileCarouselImage2", maxCount: 1 },
    { name: "mobileCarouselImage3", maxCount: 1 },
    { name: "mobileCarouselImage4", maxCount: 1 },
  ]),
  addCarousel
);

module.exports = router;
