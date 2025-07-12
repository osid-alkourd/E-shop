const express = require("express");
const router = express.Router();
const Order = require("../model/order"); // Assuming you have a Shop model
const { isAuthenticated } = require("../middleware/auth");
const { createOrder } = require("../controller/orderController");
const { validateCreateOrder } = require('../validators/orderValidator');
const { validate } = require('../middleware/validate');


router.post("/order", isAuthenticated, validateCreateOrder,validate, createOrder);

module.exports = router;
