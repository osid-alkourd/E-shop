const express = require("express");
const router = express.Router();
const shopController = require("../controller/shopController");
const { isAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const fs = require("fs").promises;
const path = require("path");
const { body, validationResult } = require("express-validator");
const Shop = require("../model/shop"); // Assuming you have a Shop model

const validateShopCreation = [
  body("name")
    .notEmpty()
    .withMessage("Shop name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3-50 characters")
    .trim()
    .escape(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .customSanitizer((value) => {
      // Remove all non-digit and non-plus characters
      return value.replace(/[^\d+]/g, "");
    })
    .custom((value) => {
      // International phone number validation rules:
      // 1. Must start with + followed by country code (1-3 digits)
      // 2. Must be 10-15 digits total (including country code)
      // 3. Must not start with +0 (invalid country code)

      if (!/^\+\d{1,3}\d{4,14}$/.test(value)) {
        throw new Error(
          "Phone number must be in international format (+[country code][number])"
        );
      }

      // Additional check to prevent +0 country codes
      if (/^\+0/.test(value)) {
        throw new Error("Invalid country code (cannot start with +0)");
      }

      return true;
    }),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("Address must be between 5-50 characters")
    .trim()
    .escape(),

  body("zipCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isLength({ min: 3, max: 12 })
    .withMessage("Postal code must be between 3-12 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("confirmedPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Only attempt to delete if file was actually uploaded
      if (req.file) {
        try {
          const filePath = path.join(
            __dirname,
            "../uploads",
            req.file.filename
          );
          await fs.access(filePath); // Check if file exists
          await fs.unlink(filePath); // Delete the file
          console.log(
            `Deleted uploaded file due to validation errors: ${filePath}`
          );
        } catch (err) {
          // If file doesn't exist or other error, just log it
          console.error("Error during file cleanup:", err);
          // Don't fail the request just because cleanup failed
        }
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

// File upload middleware comes FIRST, then validation
router.post(
  "/shops",
  upload.single("avatar"),
  validateShopCreation,
  shopController.createShop
);

// activate seller
router.post(
  "/shops/activation",
  shopController.activateShop
);

module.exports = router;
