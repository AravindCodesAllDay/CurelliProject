const User = require("../models/userModel");
const Address = require("../models/addressModel");

exports.userDetails = async (req, res) => {
  try {
    const { identifier } = req.params;
    let userId;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      userId = await User.findOne({ _id: identifier });
    } else {
      userId = await User.findOne({ mail: identifier });
    }
    const updatedUserData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedUserData);

    res.json({
      success: true,
      message: "User information updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { identifier } = req.params;

    const user = await User.findById(identifier).populate("address");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const address = new Address({
      name: req.body.name,
      address: req.body.address,
      district: req.body.district,
      state: req.body.state,
      pincode: req.body.pincode,
      addressContact: req.body.addressContact,
    });

    user.address.push(address);
    await user.save();

    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { addressId } = req.body;
    const user = await User.findById(identifier).populate("address");

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

exports.getAddress = async (req, res) => {
  try {
    const { identifier, addressId } = req.query;
    console.log(identifier, addressId);

    const user = await User.findById(identifier);

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const addressIndex = user.address.findIndex(
      (item) => item._id.toString() === addressId
    );

    if (addressIndex !== -1) {
      const userAddress = user.address[addressIndex];
      console.log(userAddress);
      return res.status(200).json(userAddress);
    } else {
      return res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
