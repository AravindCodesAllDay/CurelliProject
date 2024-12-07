const Carousel = require("../models/carouselModel");

const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3 = new S3Client({
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
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `carousel/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        try {
          const upload = new Upload({
            client: s3,
            params: uploadParams,
          });

          const s3Upload = await upload.done();
          images.push(s3Upload.Location);
        } catch (uploadError) {
          console.error("S3 upload error:", uploadError);
          return res.status(500).send("Failed to upload image to S3.");
        }
      }
    }

    await Carousel.deleteMany({ mobile: type });

    await Carousel.create({
      images: images,
      mobile: type,
    });

    res.status(200).send(`Images inserted successfully`);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Error processing request.");
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
    console.error("Error fetching carousel data:", error);
    res.status(500).send("Error fetching carousel data.");
  }
};
