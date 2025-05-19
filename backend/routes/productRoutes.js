const express = require("express");
const router = express.Router();
const { upload } = require("../multer");
const fs = require("fs").promises;
const path = require("path");
const { body, validationResult } = require("express-validator");
const Product = require("../model/product"); // Assuming you have a Shop model
const { isSeller } = require("../middleware/isSeller");
const {
  createProduct,
  getShopProducts,
  deleteProduct,
} = require("../controller/productController");
const validateProduct = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Product name cannot exceed 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 700 })
    .withMessage("Description cannot exceed 700 characters"),
  body("category").notEmpty().withMessage("Product category is required"),
  body("originalPrice")
    .notEmpty()
    .withMessage("Original price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),
  body("stock")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }));

      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }
    next();
  },
];

router.post(
  "/products",
  isSeller,
  upload.array("images", 5), // Allow up to 5 images
  validateProduct,
  createProduct
);

router.get("/products/:shopId", getShopProducts);

router.delete("/products/:id", isSeller, deleteProduct);

// router.get(
//   "/products",
//    (req,res,next) => {
//      return res.status(200).json({
//         success: true,
//         message: "all products",

//       });
//    }
// );

module.exports = router;
