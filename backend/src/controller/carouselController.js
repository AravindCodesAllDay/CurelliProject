const Carousel = require("../models/carouselModel");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

async function getCarousel(req, res, next) {
  try {
    const carousels = await Carousel.find({});
    return res.status(200).json(carousels);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error...!!");
  }
}

async function addCarousel(req, res, next) {
  try {
    const uploadToS3 = async (file, index, isMobile = false) => {
      const s3Upload = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `carousel/${Date.now()}_${file.originalname}`, // Customize path and filename
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      return {
        photo: s3Upload.Location,
        index: index,
        mobile: isMobile,
      };
    };

    // Upload all images to S3
    const carouselImages = [
      { file: req.files["carouselImage1"][0], index: 1 },
      { file: req.files["carouselImage2"][0], index: 2 },
      { file: req.files["carouselImage3"][0], index: 3 },
      { file: req.files["carouselImage4"][0], index: 4 },
      { file: req.files["mobileCarouselImage1"][0], index: 1, mobile: true },
      { file: req.files["mobileCarouselImage2"][0], index: 2, mobile: true },
      { file: req.files["mobileCarouselImage3"][0], index: 3, mobile: true },
      { file: req.files["mobileCarouselImage4"][0], index: 4, mobile: true },
    ];

    // Array of promises for S3 uploads
    const carouselInserts = await Promise.all(
      carouselImages.map((image) =>
        uploadToS3(image.file, image.index, image.mobile)
      )
    );

    // Clear old carousel images
    await Carousel.deleteMany({});

    // Insert new carousel images with S3 URLs
    await Carousel.create(carouselInserts);

    res.status(200).send("Images inserted successfully.");
  } catch (error) {
    res.status(500).send("Error processing request.");
    console.error("Error processing request:", error);
  }
}

module.exports = {
  getCarousel,
  addCarousel,
};
