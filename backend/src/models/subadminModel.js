const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const subadminSchema = new Schema({
  mail: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  pswd: {
    type: String,
    default: "team@2024",
  },
});

// Pre-save hook to hash the password before saving
subadminSchema.pre("save", async function (next) {
  const subadmin = this;

  if (!subadmin.isModified("pswd")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    subadmin.pswd = await bcrypt.hash(subadmin.pswd, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Subadmin", subadminSchema);
