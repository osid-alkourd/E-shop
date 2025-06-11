const mongoose = require("mongoose");
const { Schema } = mongoose;
const cartItemSchema = require('./cartItem')
const cartSchema = new Schema(
  {
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  {
    _id: false,
    timestamps: true, // This enables automatic createdAt/updatedAt
  }
);

module.exports = cartSchema;

