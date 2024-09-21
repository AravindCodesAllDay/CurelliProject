const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  pswd: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  cart: {
    type: Array,
  },
  wishlist: {
    type: Array,
  },
  address: {
    type: Array,
  },
  orders: {
    type: Array,
  },
});

module.exports = mongoose.model("User", userSchema);
