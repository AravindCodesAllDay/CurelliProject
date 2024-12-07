const express = require("express");
const {
  googleLogin,
  register,
  getUser,
  changePswd,
  login,
} = require("../controller/userController");

const {
  addCart,
  removeCart,
  cartQuantity,
  getCart,
} = require("../controller/cartController");

const {
  addWishlist,
  removeWishlist,
  getWishlist,
} = require("../controller/wishlistController");

const {
  userDetails,
  addAddress,
  removeAddress,
  getAddress,
} = require("../controller/profileController");

const router = express.Router();
router.get("/", getUser);

router.post("/google", googleLogin);
router.post("/login", login);
router.post("/register", register);
router.put("/changepswd", changePswd);

router.get("/cart", getCart);
router.post("/cart/:productId", addCart);
router.delete("/cart/:productId", removeCart);
router.patch("/cart/:productId/:sign", cartQuantity);

router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", addWishlist);
router.delete("/wishlist/:productId", removeWishlist);

router.patch("/profile", userDetails);
router.get("/address", getAddress);
router.post("/address", addAddress);
router.delete("/address/:addressId", removeAddress);

module.exports = router;
