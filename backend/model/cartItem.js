const mongoose = require('mongoose');
const { Schema } = mongoose;


// Cart Item schema
const cartItemSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  priceAtTimeOfPurchase: { 
    type: Number, 
    required: true 
  }
}, { 
  _id: false,
  timestamps: true // This enables automatic createdAt/updatedAt
});

module.exports = cartItemSchema;


