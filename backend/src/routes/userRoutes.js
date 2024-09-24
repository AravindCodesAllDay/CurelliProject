const express = require("express");
const {
  googleLogin,
  register,
  getUser,
  changePswd,
  getUsers,
  login,
} = require("../controller/userController");

const {
  addCart,
  removeCart,
  cartQuantity,
  emptyCart,
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

router.get("/", getUsers);
router.get("/:userId", getUser);

router.post("/google", googleLogin);
router.post("/login", login);
router.post("/register", register);
router.put("/changepswd", changePswd);

router.get("/cart/:userId", getCart);
router.post("/cart", addCart);
router.put("/cart/:sign", cartQuantity);
router.put("/cart", emptyCart);
router.delete("/cart", removeCart);

router.get("/wishlist/:userId", getWishlist);
router.post("/wishlist", addWishlist);
router.delete("/wishlist", removeWishlist);

router.put("/profile", userDetails);

router.get("/address/:userId", getAddress);
router.post("/address", addAddress);
router.delete("/address", removeAddress);

module.exports = router;
