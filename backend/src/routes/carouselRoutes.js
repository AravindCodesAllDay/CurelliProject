const express = require("express");
const multer = require("multer");

const Carousel = require("../models/carouselModel");

const router = express.Router();

const carouselStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/carousels");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const carouselUpload = multer({ storage: carouselStorage });

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
  async (req, res) => {
    try {
      const carouselImageName1 = req.files["carouselImage1"][0].filename;
      const carouselImageName2 = req.files["carouselImage2"][0].filename;
      const carouselImageName3 = req.files["carouselImage3"][0].filename;
      const carouselImageName4 = req.files["carouselImage4"][0].filename;
      const mobileCarouselImageName1 =
        req.files["mobileCarouselImage1"][0].filename;
      const mobileCarouselImageName2 =
        req.files["mobileCarouselImage2"][0].filename;
      const mobileCarouselImageName3 =
        req.files["mobileCarouselImage3"][0].filename;
      const mobileCarouselImageName4 =
        req.files["mobileCarouselImage4"][0].filename;

      const carouselInserts = [
        { photo: carouselImageName1, index: 1 },
        { photo: carouselImageName2, index: 2 },
        { photo: carouselImageName3, index: 3 },
        { photo: carouselImageName4, index: 4 },
        { photo: mobileCarouselImageName1, mobile: true, index: 1 },
        { photo: mobileCarouselImageName2, mobile: true, index: 2 },
        { photo: mobileCarouselImageName3, mobile: true, index: 3 },
        { photo: mobileCarouselImageName4, mobile: true, index: 4 },
      ];

      await Carousel.deleteMany({});

      try {
        await Carousel.create(carouselInserts);

        res.status(200).send("Images inserted successfully.");
      } catch (error) {
        res.status(500).send("Error inserting images.");
        console.error("Error inserting images:", error);
      }
    } catch (error) {
      res.status(500).send("Error processing request.");
      console.error("Error processing request:", error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const carousels = await Carousel.find({});
    return res.status(200).json(carousels);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error...!!");
  }
});

module.exports = router;
