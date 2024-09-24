const Products = require("../models/productModel");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, rating, ratingcount } = req.body;

    if (!name || !price || !description || !rating || !ratingcount) {
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
      photos: images,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error uploading images:", err.message);
    res.status(500).json({ error: "Error uploading images" });
  }
};

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

exports.editProduct = async (req, res) => {
  const { _id } = req.params;
  const { name, price, description, stock } = req.body;

  try {
    if (!name || !price || !description || !stock) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const product = await Products.findOne({ _id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const update = {
      name,
      price,
      description,
      stock,
    };

    const updatedProduct = await Products.findByIdAndUpdate(_id, update, {
      new: true,
    });

    return res.status(200).json({ message: "Product updated", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Products.findOne({ _id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "suspended";

    await product.save();

    return res.status(200).json({ message: "Product deleted..!!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};