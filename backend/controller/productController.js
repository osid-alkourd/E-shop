const { body, validationResult } = require("express-validator");
const Product = require("../model/product"); // Assuming you have a Shop model
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const Shop = require("../model/shop");

const createProduct = async (req, res, next) => {
  try {
    // Validate image count
    const MIN_IMAGES = 1;
    const MAX_IMAGES = 5;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        await cleanupFiles(req.files);
      }
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }
    if (!req.files || req.files.length < MIN_IMAGES) {
      return next(
        new ErrorHandler(
          `At least ${MIN_IMAGES} product image is required`,
          422
        )
      );
    }

    // if (req.files.length > MAX_IMAGES) {
    //   // Cleanup excess files
    //   await cleanupFiles(req.files);

    //   return next(
    //     new ErrorHandler(`Maximum ${MAX_IMAGES} images allowed`, 422)
    //   );
    // }

    const {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
    } = req.body;

    // Prepare images array for database
    const images = req.files.map((file) => ({
      public_id: file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/products/${
        file.filename
      }`,
      alt: name || "Product image", // Use product name as alt text if available
    }));

    // Create new product
    const product = await Product.create({
      name,
      description,
      category,
      tags: tags ? tags.split(",") : [],
      originalPrice,
      discountPrice: discountPrice || originalPrice, // Default to originalPrice if no discount
      stock,
      images,
      shop: req.shop._id, // Assuming seller ID is attached to request
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files && req.files.length > 0) {
      await cleanupFiles(req.files);
    }
    return next(new ErrorHandler(error.message, 500));
  }
};

const getShopProducts = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({
        message: "Invalid shopId format",
      });
    }
    const existShop = await Shop.findById(shopId);
    if (!existShop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    const products = await Product.find({ shop: shopId }).populate("shop");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid product ID format", 400));
  }

  try {
    const product = await Product.findById(id).populate("shop");

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Check ownership
    if (String(product.shop._id) !== String(req.shop._id)) {
      return next(
        new ErrorHandler("Not authorized to delete this product", 403)
      );
    }

    // 🧹 Delete image files
      await deleteProductImages(product.images);

    // Delete the product
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return next(new ErrorHandler("Internal server errors", 500));
  }
};
module.exports = { createProduct, getShopProducts, deleteProduct };

// Helper function for cleaning up files
const cleanupFiles = async (files) => {
  try {
    await Promise.all(
      files.map(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (unlinkErr) {
          console.error(`Failed to delete file ${file.path}:`, unlinkErr);
        }
      })
    );
  } catch (cleanupErr) {
    console.error("Error during file cleanup:", cleanupErr);
  }
};

// check if the image path is exist
const isImageExists = async (imagePath) => {
  try {
    await fs.access(imagePath);
    return true;
  } catch {
    return false;
  }
}
  const deleteProductImages = async (images) => {
    try {
      for (const image of images) {
        const imagePath = path.join(
          __dirname,
          "..",
          image.url.replace(/^.*\/uploads\//, "uploads/")
        );
        if (isImageExists(imagePath)) {
          await fs.unlink(imagePath);
        }
      }
    } catch (error) {
            console.error(error.message);

    
  };
};
