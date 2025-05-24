const { body, validationResult } = require("express-validator");
const Shop = require("../model/shop"); // Assuming you have a Shop model
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const Event = require("../model/event");
const Product = require("../model/product");
const { isValidObjectId } = require("mongoose");

const createEvent = async (req, res, next) => {
  try {
    // check if there is a images uploaded
    if (!req.files || req.files.length < 1) {
      return next(new ErrorHandler(`At least 1 event image is required`, 422));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        await cleanupFiles(req.files);
      }
      // the following is standard way to return the errors
      const formattedErrors = {};
      errors.array().forEach((err) => {
        // Use the location (body/params/query) + path if param isn't available
        const field = err.path || err.param;
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        formattedErrors[field].push(err.msg);
      });

      return res.status(422).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const {
      title,
      description,
      products,
      startDate,
      endDate,
      tags,
      stock,
      discountType,
      discountValue,
    } = req.body;

    // Process uploaded banners

    const banners = req.files?.map((file) => ({
      public_id: file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/events/${
        file.filename
      }`,
      alt: title,
    }));

    // Validate products if provided
    if (products && products.length > 0) {
      const invalidProducts = products.filter(
        (productId) => !isValidObjectId(productId)
      );
      if (invalidProducts.length > 0) {
        await cleanupFiles(req.files);
        return res.status(400).json({
          success: false,
          message: "Invalid product IDs provided",
        });
      }

      // Verify products belong to the shop
      const productsExist = await Product.find({
        _id: { $in: products }, //Returns all products whose thier _id exist inside the products array
        shop: req.shop._id,
      });

      if (productsExist.length !== products.length) {
        await cleanupFiles(req.files);
        return res.status(400).json({
          success: false,
          message: "Some products don't exist or don't belong to your shop",
        });
      }
    }

    // Create the event
    const event = await Event.create({
      title,
      description,
      shop: req.shop._id,
      products: products,
      banners: banners,
      startDate,
      endDate,
      status: new Date(startDate) > new Date() ? "upcoming" : "active",
      tags: tags ? tags.split(",") : [],
      stock: stock || 0,
      discountType: discountType || "percentage",
      discountValue: discountValue || 0,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const removeProductFromEvent = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 422));
    }
    const { eventId, productId } = req.params;

    // Find the event and verify the seller owns it
    const event = await Event.findOne({
      _id: eventId,
      shop: req.shop._id,
    });

    if (!event) {
      return next(
        new ErrorHandler("Event not found or you don't have permission", 404)
      );
    }

    // Check if product exists in the event
    const productIndex = event.products.indexOf(productId);
    if (productIndex === -1) {
      return next(new ErrorHandler("Product not found in this event", 404));
    }

    // Remove the product from the array
    event.products.splice(productIndex, 1);
    await event.save();
    res.status(200).json({
      success: true,
      message: "Product removed from event successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const addProductsToEvent = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 422));
    }

    const { eventId } = req.params;
    const { products } = req.body;

    // Find the event and verify the seller owns it
    const event = await Event.findOne({
      _id: eventId,
      shop: req.shop._id,
    });

    if (!event) {
      return next(new ErrorHandler("Not Found", 404));
    }

    // Verify all products exist and belongs to the same shop
    const existingProducts = await Product.find({
      _id: { $in: products },
      shop: req.shop._id,
    });

    if (existingProducts.length !== products.length) {
      return next(
        new ErrorHandler(
          "One or more products not found or don't belong to your shop",
          404
        )
      );
    }

    // Filter out products that are already in the event
    const newProducts = products.filter(
      (productId) => !event.products.includes(productId)
    );

    if (newProducts.length === 0) {
      return next(
        new ErrorHandler("All products are already in the event", 400)
      );
    }

    // Add new products to the event
    event.products.push(...newProducts);

    // Save the updated event
    await event.save();

    res.status(200).json({
      success: true,
      message: "Products added to event successfully",
      addedCount: newProducts.length,
      event,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const deleteEvent = async (req, res, next) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Event ID format", 400));
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    // Check ownership
    if (String(event.shop._id) !== String(req.shop._id)) {
      return next(new ErrorHandler("Not authorized to delete this event", 403));
    }

    // Delete image files
    await deleteEventImages(event.banners);

    // Delete the product
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return next(new ErrorHandler("Internal server errors", 500));
  }
};

const getAuthenticatedShopEvents = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 422));
    }
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({ shop: req.shop._id })
      .populate({
        path: "products",
        select: "name description discountPrice images stock", // Only include necessary fields
      })
      .populate({
        path: "shop",
        select: "name email avatar", // Only include necessary shop fields
      })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    // Count total events for pagination info
    const totalEvents = await Event.countDocuments({ shop: req.shop._id });

    res.status(200).json({
      success: true,
      events,
      pagination: {
        totalEvents,
        totalPages: Math.ceil(totalEvents / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const getShopEvents = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 422));
    }
    const { shopId } = req.params;
    const { status } = req.query;

     // Check if shop exists
    const shopExists = await Shop.exists({ _id: shopId });
    if (!shopExists) {
      return next(new ErrorHandler("Shop not found", 404));
    }
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { shop: shopId };
    if (status) query.status = status;



    const events = await Event.find(query)
      .populate({
        path: "products",
        select: "name description originalPrice discountPrice images stock",
      })
      .sort({ createAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      events,
      pagination: {
        totalEvents,
        totalPages: Math.ceil(totalEvents / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};


module.exports = {
  createEvent,
  removeProductFromEvent,
  addProductsToEvent,
  deleteEvent,
  getAuthenticatedShopEvents,
  getShopEvents,
};

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
};

const deleteEventImages = async (banners) => {
  try {
    for (const banner of banners) {
      const bannerPath = path.join(
        __dirname,
        "..",
        banner.url.replace(/^.*\/uploads\//, "uploads/")
      );
      if (isImageExists(bannerPath)) {
        await fs.unlink(bannerPath);
      }
    }
  } catch (error) {
    console.error(error.message);
    return next(new ErrorHandler("fail to delete files", 500));
  }
};
// const deleteProductImages = async (images) => {
//   try {
//     for (const image of images) {
//       const imagePath = path.join(
//         __dirname,
//         "..",
//         image.url.replace(/^.*\/uploads\//, "uploads/")
//       );
//       if (isImageExists(imagePath)) {
//         await fs.unlink(imagePath);
//       }
//     }
//   } catch (error) {
//     console.error(error.message);
//   }
// };
