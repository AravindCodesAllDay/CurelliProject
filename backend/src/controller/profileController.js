const User = require("../models/userModel");
const Address = require("../models/addressModel");
const { mongoose } = require("mongoose");

exports.userDetails = async (req, res) => {
  try {
    const { formData, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !formData) {
      return res.status(400).json({ message: "Invalid request" });
    }
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
};

exports.getAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Invalid request" });
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
};

exports.addAddress = async (req, res) => {
  try {
    const { userId, name, address, district, state, pincode, addressContact } =
      req.body;
    if (
      !userId ||
      !name ||
      !address ||
      !district ||
      !state ||
      !pincode ||
      !addressContact
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findById(userId).populate("address");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const newaddress = new Address({
      name,
      address,
      district,
      state,
      pincode,
      addressContact,
    });

    user.address.push(newaddress);
    await user.save();

    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const { addressId, userId } = req.body;
    if (!userId || !addressId) {
      return res.status(400).json({ message: "Invalid request" });
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
};
