const { body, check } = require("express-validator");
const { isValidObjectId } = require("mongoose");

const validateCreateOrder = [
  // Cart validation
  body("cart")
    .exists()
    .withMessage("Cart is required")
    .isObject()
    .withMessage("Cart must be an object"),

  body("cart.items")
    .exists()
    .withMessage("Cart items are required")
    .isArray({ min: 1 })
    .withMessage("Cart must contain at least one item"),

  body("cart.items.*.product") // Validate the product field inside each object in the cart.items array
    .exists()
    .withMessage("Product ID is required")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid product ID format"),

  body("cart.items.*.quantity") // Validate the quantity field inside each object in the cart.items array
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("cart.items.*.priceAtTimeOfPurchase") // Validate the quantity field inside each object in the cart.items array
    .exists()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  // Address validation
  body("shippingAddress")
    .exists()
    .withMessage("Shipping address is required")
    .isObject()
    .withMessage("Shipping address must be an object"),

  body("shippingAddress.street")
    .exists()
    .withMessage("Street is required")
    .isString()
    .withMessage("Street must be a string")
    .trim()
    .notEmpty()
    .withMessage("Street cannot be empty"),

  body("shippingAddress.city")
    .exists()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string")
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),

  body("shippingAddress.city")
    .exists()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string")
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty")
    .isLength({ max: 100 })
    .withMessage("City cannot exceed 100 characters"),

  body("shippingAddress.state")
    .exists()
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string")
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty")
    .isLength({ max: 100 })
    .withMessage("State cannot exceed 100 characters"),

  body("shippingAddress.zipCode")
    .exists()
    .withMessage("Zip code is required")
    .isString()
    .withMessage("Zip code must be a string")
    .trim()
    .notEmpty()
    .withMessage("Zip code cannot be empty")
    .matches(/^[0-9a-zA-Z\- ]+$/)
    .withMessage("Invalid zip/postal code format")
    .isLength({ min: 3, max: 20 })
    .withMessage("Zip code must be 3-20 characters"),

  body("shippingAddress.country")
    .exists()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string")
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Country cannot exceed 100 characters"),

  // Billing address (optional - if not provided, use shipping address)
  body("billingAddress")
    .optional()
    .isObject()
    .withMessage("Billing address must be an object"),

  // Street
  body("billingAddress.street")
    .if(body("billingAddress").exists())
    .exists()
    .withMessage("Billing street is required when providing billing address")
    .isString()
    .withMessage("Billing street must be a string")
    .trim()
    .notEmpty()
    .withMessage("Billing street cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Billing street cannot exceed 200 characters"),

  // City
  body("billingAddress.city")
    .if(body("billingAddress").exists())
    .exists()
    .withMessage("Billing city is required when providing billing address")
    .isString()
    .withMessage("Billing city must be a string")
    .trim()
    .notEmpty()
    .withMessage("Billing city cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Billing city cannot exceed 100 characters"),

  //state
  body("billingAddress.state")
    .if(body("billingAddress").exists())
    .exists()
    .withMessage("Billing state is required when providing billing address")
    .isString()
    .withMessage("Billing state must be a string")
    .trim()
    .notEmpty()
    .withMessage("Billing state cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Billing state cannot exceed 100 characters"),

  // Zip Code
  body("billingAddress.zipCode")
    .if(body("billingAddress").exists())
    .exists()
    .withMessage("Billing zip code is required when providing billing address")
    .isString()
    .withMessage("Billing zip code must be a string")
    .trim()
    .notEmpty()
    .withMessage("Billing zip code cannot be empty")
    .matches(/^[0-9a-zA-Z\- ]+$/)
    .withMessage("Invalid billing zip/postal code format")
    .isLength({ min: 3, max: 20 })
    .withMessage("Billing zip code must be 3-20 characters"),

  // Country
  body("billingAddress.country")
    .if(body("billingAddress").exists())
    .exists()
    .withMessage("Billing country is required when providing billing address")
    .isString()
    .withMessage("Billing country must be a string")
    .trim()
    .notEmpty()
    .withMessage("Billing country cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Billing country cannot exceed 100 characters"),

  // Payment method validation
  body("paymentMethod")
    .exists()
    .withMessage("Payment method is required")
    .isObject()
    .withMessage("Payment method must be an object"),

  body("paymentMethod.type")
    .exists()
    .withMessage("Payment type is required")
    .isIn(["stripe"])
    .withMessage("Invalid payment type"),

  body("paymentMethod.method")
    .exists()
    .withMessage("Payment method is required")
    .isString()
    .withMessage("Payment method must be a string")
    .trim()
    .notEmpty()
    .withMessage("Payment method cannot be empty"),
];

module.exports = {
  validateCreateOrder
};