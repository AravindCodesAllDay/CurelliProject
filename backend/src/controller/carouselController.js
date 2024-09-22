const Carousel = require("../models/carouselModel");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.addCarousel = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).send("Missing or invalid 'type' field.");
    }

    let images = [];

    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const s3Upload = await s3
          .upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `carousel/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
          .promise();
        images.push(s3Upload.Location);
      }
    }

    await Carousel.deleteMany({ mobile: type });

    await Carousel.create({
      images: images,
      mobile: type,
    });

    res
      .status(200)
      .send(`Images inserted successfully for ${type ? "mobile" : "desktop"}.`);
  } catch (error) {
    res.status(500).send("Error processing request.");
    console.error("Error processing request:", error);
  }
};

exports.getCarousel = async (req, res, next) => {
  try {
    const lapCarousel = await Carousel.find({ mobile: false });
    const lapImages = lapCarousel.map((carousel) => carousel.images).flat();

    const mobileCarousel = await Carousel.find({ mobile: true });
    const mobileImages = mobileCarousel
      .map((carousel) => carousel.images)
      .flat();

    res.status(200).json({
      lap: lapImages,
      mobile: mobileImages,
    });
  } catch (error) {
    res.status(500).send("Error fetching carousel data.");
    console.error("Error fetching carousel data:", error);
  }
};
