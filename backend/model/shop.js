const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require('validator'); // Add this at the top of your Shop model file

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your shop name!"],
  },

  email: {
    type: String,
    required: [true, "Please enter your shop email address"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },

  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String, // Should be String, not Number (to preserve + and leading zeros)
    required: true,
    match: [/^\+?\d{10,15}$/, "Please enter a valid phone number"],
    // validate: {
    //   validator: function (v) {
    //     return validator.isMobilePhone(v, "any", { strictMode: true });
    //   },
    //   message: "Invalid phone number format",
    // },
  },

  role: {
    type: String,
    default: "Seller",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  zipCode: {
    type: String,
    required: [true, "ZIP Code is required"],
    match: [/^[a-zA-Z0-9\s-]{3,10}$/, "Please enter a valid ZIP Code"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  //   withdrawMethod: {
  //     type: Object,
  //   },
});

// Hash password
shopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// comapre password
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("Shop", shopSchema);
