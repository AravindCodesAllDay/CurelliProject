const express = require("express");
const {
  googleLogin,
  register,
  getUser,
  changePswd,
  getUsers,
} = require("../controllers/userController");
const {
  addCart,
  removeCart,
  cartQuantity,
  emptyCart,
} = require("../controller/cartController");
const {
  addWishlist,
  removeWishlist,
} = require("../controller/wishlistController");
const {
  userDetails,
  addAddress,
  removeAddress,
  getAddress,
} = require("../controller/profileController");
const { login } = require("../controller/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:identifier", getUser);

router.post("/google", googleLogin);

router.post("/login", login);
router.post("/", register);
router.put("/changepswd/:userId", changePswd);

router.post("/cart", addCart);
router.delete("/cart", removeCart);
router.post("/cartquantity", cartQuantity);
router.put("/cart/:identifier", emptyCart);

router.post("/wishlist", addWishlist);
router.delete("/wishlist", removeWishlist);

router.put("/edit/:identifier", userDetails);

router.get("/address", getAddress);
router.post("/address/:identifier", addAddress);
router.delete("/address/:identifier", removeAddress);

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in", // Zoho's SMTP server hostname
  port: 587, // Port number for SMTP (587 is commonly used for secure transmission)
  secure: false, // Indicates if the connection should use TLS (true for 465, false for 587)
  auth: {
    user: "contact@curellifoods.com", // SMTP username (your email address)
    pass: "Curellifoods@2023", // SMTP password
  },
});

async function sendOTP(email, otp, transporter) {
  const mailOptions = {
    from: "contact@curellifoods.com",
    to: email,
    subject: "Verification from Curelli",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send OTP");
  }
}

router.post("/sendOTP", async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    await sendOTP(req.body.mail, otp, transporter); // Await sendOTP function
    res.json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
