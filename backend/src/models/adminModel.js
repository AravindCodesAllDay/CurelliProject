const mongoose = require("mongoose");

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
    required: true,
  },
  status: {
    type: String,
    enum: ["admin", "subadmin"],
    required: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
