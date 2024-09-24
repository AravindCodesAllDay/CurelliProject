const mongoose = require("mongoose");
const cartModel = require("./cartModel");
const addressModel = require("./addressModel");

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
    type: [cartModel.schema],
    default: [],
  },
  wishlist: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    default: [],
  },
  address: {
    type: [addressModel.schema],
    default: [],
  },
  orders: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
