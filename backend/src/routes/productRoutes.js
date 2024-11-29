const express = require("express");
const multer = require("multer");
const {
  addProduct,
  getProduct,
  editProduct,
  getProducts,
} = require("../controller/productController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.fields([{ name: "images", maxCount: 5 }]), addProduct);
router.get("/", getProducts);
router.get("/:_id", getProduct);
router.put(
  "/:_id",
  upload.fields([{ name: "images", maxCount: 5 }]),
  editProduct
);

module.exports = router;

module.exports = router;
