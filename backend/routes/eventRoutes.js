const express = require("express");
const router = express.Router();
const { upload } = require("../multer");
const fs = require("fs").promises;
const path = require("path");
// const { body, validationResult } = require("express-validator");
const Product = require("../model/product"); // Assuming you have a Shop model
const { isSeller } = require("../middleware/isSeller");
const {
  createEvent,
  removeProductFromEvent,
  addProductsToEvent,
  deleteEvent,
  getAuthenticatedShopEvents,
  getShopEvents
} = require("../controller/eventController");
const { body, param, query, validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const { isValidObjectId } = require("mongoose");

// create event validation rules
const eventValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Event title is required")
    .isLength({ min: 4 })
    .withMessage("Title must be at least 4 characters")
    .isLength({ max: 100 })
    .withMessage("Title cannot be longer than 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Event description is required")
    .isLength({ min: 4 })
    .withMessage("Description must be at least 4 characters")
    .isLength({ max: 2000 })
    .withMessage("Description cannot be longer than 2000 characters"),

  // Products validation
  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required")
    .custom((products) => products.every((id) => isValidObjectId(id)))
    .withMessage("Invalid Product ID in products array"),

  // Dates validation
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date format")
    .toDate(),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date format")
    .toDate()
    .custom((endDate, { req }) => {
      if (endDate <= req.body.startDate) {
        throw new ErrorHandler(`End date must be after start date`, 422);
      }
      return true;
    }),

  // Status validation
  body("status")
    .optional()
    .isIn(["upcoming", "active", "ended", "cancelled"])
    .withMessage("Invalid status value"),

  body("tags")
    .optional()
    .isString()
    .withMessage("Tags must be a comma-separated string")
    .isLength({ min: 5, max: 200 })
    .withMessage("Tags must be between 10 and 200 characters"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  // Discount validation
  body("discountType")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("Invalid discount type"),

  body("discountValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a non-negative number")
    .custom((value, { req }) => {
      if (req.body.discountType === "percentage" && value > 100) {
        throw new ErrorHandler(`Percentage discount cannot exceed 100`, 422);
      }
      return true;
    }),
];

// validation rule for delete product from event
const validateDeleteProductFromEvent = [
  param("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid Event ID"),

  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid Product ID"),
];

const validateAddProductsToEvent = [
  param("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid Event ID"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required")
    .custom((products) => products.every((id) => isValidObjectId(id)))
    .withMessage("Invalid Product ID in products array"),
];

const validateGetAuthenticatedShopEvents = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];


const validateGetSpecificShopEvent = [
   [
    param("shopId")
      .notEmpty()
      .withMessage("Shop ID is required")
      .custom((value) => isValidObjectId(value))
      .withMessage("Invalid Shop ID"),
    query("status")
      .optional()
      .isIn(["upcoming", "active", "ended", "cancelled"])
      .withMessage("Invalid status value"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
  ],
]
router.post(
  "/events",
  isSeller,
  upload.array("banners", 5), // Allow up to 5 images
  eventValidationRules,
  createEvent
);

// remove product from event
router.delete(
  "/events/:eventId/products/:productId",
  isSeller,
  validateDeleteProductFromEvent,
  removeProductFromEvent
);

// add new product to event
router.put(
  "/events/:eventId/products",
  isSeller,
  validateAddProductsToEvent,
  addProductsToEvent
);

// remove event
router.delete("/events/:id", isSeller, deleteEvent);

// get events for the current shop 
router.get("/shop/events", isSeller, validateGetAuthenticatedShopEvents, getAuthenticatedShopEvents);

// get events for spceific shop by shop id
router.get("/shop/:shopId/events", isSeller, validateGetSpecificShopEvent, getShopEvents);




module.exports = router;
