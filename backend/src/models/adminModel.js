const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
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
  status: {
    type: String,
    enum: ["admin", "subadmin"],
    required: true,
  },
});

// Middleware to hash password before saving
adminSchema.pre("save", async function (next) {
  const admin = this;

  if (!admin.isModified("pswd")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    admin.pswd = await bcrypt.hash(admin.pswd, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Admin", adminSchema);
