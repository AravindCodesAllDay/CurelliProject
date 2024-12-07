const User = require("../models/userModel");
const Address = require("../models/addressModel");
const { mongoose } = require("mongoose");
const { verifyToken } = require("../controller/tokenController");

// Update User Details
async function userDetails(req, res) {
  try {
    const { name, gender, mail, phone, dob } = req.body;

    if (!name || !gender || !mail || !phone || !dob) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    formData = {
      name,
      gender,
      mail,
      phone,
      dob,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, formData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User information updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Get Address
async function getAddress(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    return res.status(200).json(user.address);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add Address
async function addAddress(req, res) {
  try {
    const { name, address, district, state, pincode, addressContact } =
      req.body;

    if (
      !name ||
      !address ||
      !district ||
      !state ||
      !pincode ||
      !addressContact
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId).populate("address");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const newAddress = new Address({
      name,
      address,
      district,
      state,
      pincode,
      addressContact,
    });

    user.address.push(newAddress);
    await user.save();

    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Remove Address
async function removeAddress(req, res) {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId).populate("address");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.address.findIndex(
      (item) => item._id.toString() === addressId
    );

    if (addressIndex !== -1) {
      user.address.splice(addressIndex, 1);
      await user.save();
      return res.status(200).json({ message: "Address deleted successfully" });
    } else {
      return res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  userDetails,
  getAddress,
  addAddress,
  removeAddress,
};
