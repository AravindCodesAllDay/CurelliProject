const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const tokenRoutes = require("./routes/tokenRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const bestsellerRoutes = require("./routes/bestsellerRoutes");
const carouselRoutes = require("./routes/carouselRoutes");
const adminRoutes = require("./routes/adminRoutes");
const shiprocketRoutes = require("./routes/shiprocketRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");

const app = express();

app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

if (!CONNECTION) {
  console.error("Connection string is not provided.");
  process.exit(1);
}

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err instanceof mongoose.Error.ValidationError) {
    return res
      .status(400)
      .json({ message: "Validation Error", error: err.errors });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Resource not found" });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

app.use("/token", tokenRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/bestseller", bestsellerRoutes);
app.use("/carousel", carouselRoutes);
app.use("/admin", adminRoutes);
app.use("/shiprocket", shiprocketRoutes);
app.use("/razorpay", razorpayRoutes);

const start = async () => {
  try {
    mongoose
      .connect(CONNECTION)
      .then(() => {
        console.log("Connected to MongoDB successfully!");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
      });

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB disconnected through app termination");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    }
  });
};

start();
