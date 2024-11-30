const Products = require("../models/productModel");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error...!!");
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Products.findOne({ _id });

    if (!product) {
      return res.status(404).send("No products found...!!");
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      rating,
      ratingcount,
      sku,
      hsn,
      weight,
      length,
      breadth,
      height,
    } = req.body;

    if (
      !name ||
      !price ||
      !description ||
      !rating ||
      !ratingcount ||
      !sku ||
      !hsn ||
      !weight ||
      !length ||
      !breadth ||
      !height
    ) {
      return res.status(400).send("Missing required fields");
    }

    let images = [];

    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `products/${Date.now()}_${file.originalname}`,
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
          return res.status(500).json({ error: "Error uploading images" });
        }
      }
    }

    const newProduct = new Products({
      name,
      price,
      description,
      rating,
      ratingcount,
      sku,
      hsn,
      weight,
      length,
      breadth,
      height,
      photos: images,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error uploading images:", err.message);
    res.status(500).json({ error: "Error uploading images" });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      name,
      price,
      description,
      status,
      rating,
      ratingcount,
      sku,
      hsn,
      weight,
      length,
      breadth,
      height,
    } = req.body;

    if (
      !name?.trim() ||
      !price?.trim() ||
      !description?.trim() ||
      !status?.trim() ||
      !rating?.trim() ||
      !ratingcount?.trim() ||
      !sku?.trim() ||
      !hsn?.trim() ||
      !weight?.trim() ||
      !length?.trim() ||
      !breadth?.trim() ||
      !height?.trim()
    ) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    let images = [];
    if (req.files && req.files["images"]) {
      for (let file of req.files["images"]) {
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `products/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        try {
          const upload = new Upload({ client: s3, params: uploadParams });
          const s3Upload = await upload.done();
          images.push(s3Upload.Location);
        } catch (uploadError) {
          console.error("S3 upload error:", uploadError);
          return res.status(500).json({ error: "Error uploading images" });
        }
      }
    }

    const product = await Products.findById(_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const update = {
      name,
      price,
      description,
      status,
      rating,
      ratingcount,
      sku,
      hsn,
      weight,
      length,
      breadth,
      height,
    };
    if (images.length > 0) update.photos = images;

    const updatedProduct = await Products.findByIdAndUpdate(_id, update, {
      new: true,
    });

    return res.status(200).json({ message: "Product updated", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
