const mongoose = require("mongoose");

// Define the BlackListToken schema
const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },

  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation time
  },
  expiresAt: {
    type: Date, // Optional, if you want tokens to expire after a set period
    required: false,
  },
  userId: {
    // New field added to store the user ID related to the blacklisted token
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a 'User' model for referencing
    required: false, // This field is optional
  },
});

// Create the BlackListToken model
const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema);

module.exports = BlackListToken;
