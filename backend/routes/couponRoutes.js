const { body } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const Coupon = require("../model/coupon");
const { isValidObjectId } = require("mongoose");
const {
  createCoupon,
  updateCoupon,
} = require("../controller/couponController");
const express = require("express");
const router = express.Router();
const { isSeller } = require("../middleware/isSeller");

const couponCodeValidation = [
  body("code")
    .notEmpty()
    .withMessage("Coupon code is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Coupon code must be at least 5 characters")
    .isLength({ max: 20 })
    .withMessage("Coupon code cannot exceed 20 characters")
    .isUppercase()
    .withMessage("Coupon code must be uppercase")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("Coupon code can only contain letters and numbers"),

  // For description field
  body("description")
    .optional() // Since it's not required in your schema
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  // For discountType field
  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required")
    .isString()
    .withMessage("Discount type must be a string")
    .isIn(["percentage", "fixed", "free_shipping"])
    .withMessage(
      "Invalid discount type. Must be one of: percentage, fixed, free_shipping"
    ),

  body("discountValue")
    .if(body("discountType").not().equals("free_shipping"))
    .notEmpty()
    .withMessage(
      "Discount value is required when discount type is not free_shipping"
    )
    .isFloat({ min: 0 })
    .withMessage("Discount value cannot be negative")
    .custom((value, { req }) => {
      if (req.body.discountType === "percentage" && value > 100) {
        throw new ErrorHandler(`Percentage discount cannot exceed 100%`, 422);
      }

      return true;
    }),

  // For minimumOrderAmount
  body("minimumOrderAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order amount cannot be negative")
    .default(0)
    .toFloat(),

  // For maximumDiscountAmount
  body("maximumDiscountAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount amount cannot be negative")
    .custom((value, { req }) => {
      if (
        req.body.discountType === "free_shipping" &&
        value !== undefined &&
        value != 0
      ) {
        throw new ErrorHandler(
          "Maximum discount amount not applicable for free shipping coupons....",
          422
        );
      }
      return true;
    }).toFloat(),

  // Start date validation
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date")
    .customSanitizer((value) => new Date(value))
    .custom((value) => {
      if (value < new Date()) {
        throw new ErrorHandler("Start date cannot be in the past", 422);
      }
      return true;
    })
    .default(() => new Date()),

  // End date validation
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .customSanitizer((value) => new Date(value))
    .custom((value, { req }) => {
      if (value <= req.body.startDate) {
        throw new ErrorHandler("End date must be after start date", 422);
      }
      return true;
    }),

  // maxUses validation
  body("maxUses")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maximum uses must be at least 1")
    .default(100)
    .toInt(),

  // currentUses validation
  body("currentUses")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current uses cannot be negative")
    .default(0)
    .toInt(),

  // Enhanced products validation with existence check
  body("products")
    .optional()
    .isArray()
    .withMessage("Products must be an array")
    .custom((value) => {
      if (!value.every((id) => isValidObjectId(id))) {
        throw new ErrorHandler(
          "All product IDs must be valid MongoDB ObjectIds",
          422
        );
      }
      return true;
    }),

  // categories validation remains the same
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array")
    .custom((value) => {
      if (!value.every((item) => typeof item === "string")) {
        throw new ErrorHandler("All categories must be text");
      }
      return true;
    }),

  // isActive validation
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a true or false")
    .toBoolean()
    .default(true),

  // isSingleUse validation
  body("isSingleUse")
    .optional()
    .isBoolean()
    .withMessage("isSingleUse must be a boolean")
    .toBoolean()
    .default(false),
];

router.post("/coupons", isSeller, couponCodeValidation, createCoupon);

router.put("/coupons/:id", isSeller, couponCodeValidation, updateCoupon);

module.exports = router;
