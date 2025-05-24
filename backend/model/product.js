const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [700, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
    },

    tags: [{ type: String }],

    originalPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be at least 0"],
      set: (val) => Math.round(val * 100) / 100,
    },

    discountPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be at least 0"],
      set: (val) => Math.round(val * 100) / 100,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        alt: { type: String, default: "" }, // For SEO and accessibility
      },
    ],

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
