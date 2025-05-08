const { body, validationResult } = require("express-validator");
const Shop = require("../model/shop"); // Assuming you have a Shop model
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const sendShopToken = require('../utils/sendShopToken')
// const bcrypt = require("bcryptjs");

const ACTIVATION_TOKEN_EXPIRY = "10m";
const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL || "http://localhost:3000";
const UPLOADS_BASE_PATH = "/uploads";

const createActivationToken = (shopId) => {
  return jwt.sign({ id: shopId }, process.env.ACTIVATION_SECRET, {
    expiresIn: ACTIVATION_TOKEN_EXPIRY,
  });
};

const generateActivationUrl = (token) => {
  return `${FRONTEND_BASE_URL}/activation-shop/${token}`;
};

const getAvatarUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}${UPLOADS_BASE_PATH}/${filename}`;
};

const sendActivationEmail = async (shop, activationUrl) => {
  const emailContent = {
    email: shop.email,
    subject: "Activate Your Shop Account",
    message: `Hello ${shop.name},\n\nWelcome to our platform! Please click the following link to activate your shop account:\n\n${activationUrl}\n\nThis link will expire in 10 minutes.`,
  };

  await sendMail(emailContent);
};

// create shop
const createShop = async (req, res, next) => {
  if (!req.file) {
    //return next(new ErrorHandler("Avatar image is required", 400));
   
  }
  try {
    const { name, email, phoneNumber, address, zipCode, password } = req.body;

    // Check for existing shop
    const existingShop = await Shop.findOne({ email });

    if (existingShop) {
      await fs.unlink(req.file.path); // Cleanup uploaded file
      if (existingShop.status === "active") {
        return next(
          new ErrorHandler(
            "Email is already registered with an active shop",
            400
          )
        );
      }
      // Resend activation for inactive shop
      const activationToken = createActivationToken(existingShop._id);
      const activationUrl = generateActivationUrl(activationToken);

      await sendActivationEmail(existingShop, activationUrl);

      return res.status(200).json({
        success: true,
        message: `Email already exsit, Activation link resent to ${email}. Please check your email.`,
        activationUrl: activationUrl,
      });
    }

    // Create new shop
    const shopData = {
      name,
      email,
      phoneNumber,
      address,
      zipCode,
      password,
      avatar: getAvatarUrl(req, req.file.filename),
      status: "inactive",
    };

    // Generate activation token and URL
    const shop = await Shop.create(shopData);

    const activationToken = createActivationToken(shop._id);
    const activationUrl = generateActivationUrl(activationToken);

    try {
      await sendActivationEmail(shop, activationUrl);

      res.status(201).json({
        success: true,
        message: `Activation link sent to ${email}. Please check your email to complete registration.`,
        activationUrl: activationUrl, // For development/testing only
      });
    } catch (emailError) {
      // Cleanup on email failure
      await Promise.all([
        Shop.findByIdAndDelete(shop._id),
        fs.unlink(req.file.path),
      ]);
      return next(
        new ErrorHandler(
          "Failed to send activation email. Please try again.",
          500
        )
      );
    }
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    return next(new ErrorHandler(error.message, 500));
  }
};

// activate the seller
const activateShop = async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    // Verify the activation token
    const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!decoded) {
      return next(new ErrorHandler("Invalid activation token", 400));
    }

    // Find the shop by ID from the token
    const shop = await Shop.findById(decoded.id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    // Check if shop is already active
    if (shop.status === "active") {
      return next(new ErrorHandler("Shop is already activated", 400));
    }
     // Activate the shop
     shop.status = "active";
     await shop.save();
     sendShopToken(shop,201,res);
     
  } catch (error) {
    return next(new ErrorHandler("مالك", 500));

  }
};


module.exports = { createShop, activateShop };
