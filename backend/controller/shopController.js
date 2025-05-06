const { body, validationResult } = require("express-validator");
const Shop = require("../model/shop"); // Assuming you have a Shop model
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
// const bcrypt = require("bcryptjs");

const createActivationToken = (shopId) => {
  return jwt.sign({ id: shopId }, process.env.ACTIVATION_SECRET, {
    expiresIn: "10m", // 10 minutes expiration
  });
};

const createShop = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorHandler("Avatar image is required", 400));
    }
    const { name, email, phoneNumber, address, zipCode, password } = req.body;

    // 3. Check existing shop
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

      const activationToken = createActivationToken(existingShop._id);
      const activationUrl = `http://localhost:3000/activation-shop/${activationToken}`;

      await sendMail({
        email: existingShop.email,
        subject: "Activate Your Shop Account",
        message: `Hello ${existingShop.name},\n\nPlease click the following link to activate your shop account:\n\n${activationUrl}\n\nThis link will expire in 10 minutes.`,
      });

      return res.status(200).json({
        success: true,
        message: `Activation link resent to ${email}. Please check your email.`,
        activationUrl: activationUrl,
      });
    }

    // 5. Create new shop
    const shop = await Shop.create({
      name,
      email,
      phoneNumber,
      address,
      zipCode,
      password,
      avatar: `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`,
      status: "inactive",
    });

    // 6. Generate and send activation token
    const activationToken = createActivationToken(shop._id);
    const activationUrl = `http://localhost:3000/activation-shop/${activationToken}`;

    try {
      await sendMail({
        email: shop.email,
        subject: "Activate Your Shop Account",
        message: `Hello ${shop.name},\n\nWelcome to our platform! Please click the following link to activate your shop account:\n\n${activationUrl}\n\nThis link will expire in 10 minutes.`,
      });

      res.status(201).json({
        success: true,
        message: `Activation link sent to ${email}. Please check your email to complete registration.`,
        activationUrl: activationUrl,
      });
    } catch (emailError) {
      await Shop.findByIdAndDelete(shop._id);
      await fs.unlink(req.file.path);
      return next(
        new ErrorHandler(
          "Failed to send activation email. Please try again.",
          500
        )
      );
    }
  
  } catch (error) {
    // Cleanup uploaded file on any error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = { createShop };
