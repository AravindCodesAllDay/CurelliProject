const express = require("express");
const multer = require("multer");

const Products = require("../models/productModel");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { name, price, description, rating, numOfRating } = req.body;

      if (
        !name ||
        !price ||
        !description ||
        !price ||
        !rating ||
        !numOfRating
      ) {
        return res.status(400).send("Missing required fields");
      }

      let images = [];
      console.log(req.files["images"]);

      const coverImage = req.files["coverImage"][0].filename;
      images = req.files["images"].map((file) => file.filename);

      // Create a new product object
      const newProduct = new Products({
        name,
        price,
        description,
        rating,
        numOfRating,
        photo: coverImage,
        moreImg: images,
      });

      const product = await newProduct.save();

      res.status(201).json(product);
    } catch (err) {
      console.error("Error uploading images:", err.message);
      res.status(500).json({ error: "Error uploading images" });
    }
  }
);

router.post("/test", async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      rating,
      numOfRating,
      coverImage,
      images,
    } = req.body;

    console.log(
      name,
      price,
      description,
      rating,
      numOfRating,
      coverImage,
      images
    );
    const newProduct = new Products({
      name: name,
      price: price,
      photo: coverImage,
      moreImg: images,
      description: description,
      rating: rating,
      numOfRating: numOfRating,
    });

    const product = await Products.create(newProduct);
    return res.status(200).send(product);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error...!!");
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Products.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error...!!");
  }
});

router.get("/:_id", async (req, res) => {
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
});

router.put("/:_id", async (req, res) => {
  const { _id } = req.params;
  const { name, price, description, stock } = req.body;
  console.log(req.body);

  try {
    if (!name || !price || !description || !stock) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const product = await Products.findOne({ _id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const update = {
      name: name,
      price: price,
      description: description,
      stock: stock,
    };

    const updatedProduct = await Products.findByIdAndUpdate(_id, update);

    return res.status(200).json({ message: "Product updated", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await Products.deleteOne({ _id });
    return res.status(201).send("Product Deleted..!!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;
