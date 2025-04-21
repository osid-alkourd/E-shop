const User = require("../model/user"); // ✅ Import model
const express = require("express");
const router = express.Router();
const { upload } = require("../multer");
const path = require("path");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const bcrypt = require("bcrypt");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const fs = require("fs").promises;

// const sendToken = require("../utils/jwtToken");

router.post("/register", upload.single("avatar"), async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      if (req.file) {
        await fs.unlink(path.join(__dirname, "../uploads", req.file.filename));
      }
      return next(new ErrorHandler("Passwords do not match", 400));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) {
        await fs.unlink(path.join(__dirname, "../uploads", req.file.filename));
      }
      return next(new ErrorHandler("the email is already exist", 400));
    }
    const fileName = req.file.filename;
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: { public_id: fileName, url: fullUrl },
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      console.log("osid step");
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
        content: activationUrl, // not should return but because my email do not send message (verification code)
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "6m" });
};

router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activation_token } = req.body;
    try {
      // console.log("activation_token received from frontend:", req.body.activation_token);
      const user = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
      // if (!user) {
      //   return next(new ErrorHandler("Invalid token", 400));
      // }
      const { name, email, password, avatar } = user;
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const newUser = await User.create({ name, email, avatar, password });
      sendToken(newUser, 201, res);
    } catch (err) {
      try {
        const decoded = jwt.decode(activation_token);
        const fileName = decoded?.avatar?.public_id;

        if (fileName) {
          const filePath = path.join(__dirname, "../uploads", fileName);
          await fs.unlink(filePath);
          console.log("✅ Avatar deleted due to invalid/expired token.");
        }
      } catch (decodeErr) {
        console.error("Could not decode token:", decodeErr.message);
      }
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

// login
router.post(
  "/login",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorHandler("Please enter both email and password", 400)
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  })
);
module.exports = router;
