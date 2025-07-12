const Order = require("../model/order");
const Cart = require("../model/cart");
const Product = require("../model/product");
const { calculateOrderTotals } = require("../utils/orderUtils");
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    const { cart, shippingAddress, billingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    const result = await calculateOrderTotals(cart);
    if (result.allProudctsExist === false) {
      return res.status(400).json({
        message: "Some Products not exist"
      });
    }
    if (result.outOfStockItems.length > 0) {
      return res.status(400).json({
        message: "Some items are out of stock",
        outOfStockItems: result.outOfStockItems,
      });
    }

    const order = new Order({
      user: userId,
      cart: result.updatedCart,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

module.exports = {
  createOrder,
};
