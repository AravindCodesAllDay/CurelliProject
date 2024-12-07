const mongoose = require("mongoose");
const cartModel = require("./cartModel");
const addressModel = require("./addressModel");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    phone: {
      type: Number,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    isgoogle: {
      type: Boolean,
      required: true,
    },
    pswd: {
      type: String,
      validate: {
        validator: function (value) {
          if (!this.isgoogle && (!value || value.trim() === "")) {
            return false;
          }
          return true;
        },
        message: "Password is required if Google login is not used.",
      },
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
      validate: {
        validator: function (v) {
          return v.every((item) => item.quantity > 0);
        },
        message: "Cart items must have a quantity greater than zero.",
      },
    },

    wishlist: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
      validate: {
        validator: function (v) {
          return new Set(v.map((id) => id.toString())).size === v.length;
        },
        message: "Duplicate items in wishlist are not allowed.",
      },
    },

    address: {
      type: [addressModel.schema],
      default: [],
    },
    orders: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
