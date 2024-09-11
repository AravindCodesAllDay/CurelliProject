const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  pswd: {
    type: String,
    require: true,
  },
  subusers: {
    type: Array,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
