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
const { isAuthenticated } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const BlackListToken = require("../model/blackListToken");
// const sendToken = require("../utils/jwtToken");

// Rate limiter for login (prevent brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: "Too many login attempts, please try again later",
});

router.post(
  "/register",
  upload.single("avatar"),
  [
    body("avatar").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Avatar image is required");
      }
      return true;
    }),
  ],
  async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "../uploads/users", req.file.filename)
          );
        }
        return next(new ErrorHandler("Passwords do not match", 400));
      }
      // if(!req.file){
      //   return res.status(400).json({ error: "No file uploaded." });

      // }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "../uploads/users", req.file.filename)
          );
        }
        return next(new ErrorHandler("the email is already exist", 400));
      }
      let fileName = "";
      let fullUrl = "";
      if (req.file) {
        fileName = req.file.filename;
        fullUrl = `${req.protocol}://${req.get("host")}/uploads/users/${fileName}`;
      } else {
        (fileName = "no file name"), (fullUrl = "no file url");
      }

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
  }
);

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "10m" });
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
          const filePath = path.join(__dirname, "../uploads/users", fileName);
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
  // loginLimiter,
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(), // Standardize email format (e.g., lowercase),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters"),
  ],
  catchAsyncErrors(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return next(new ErrorHandler(errorMessages.join(", "), 400));
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    const dummyHash =
      "$2a$10$z0vqhd3rRtVXeFZK8BfKzO8N5xZ9Px3FkMZPQzj1jSt7k6H6PV5C6";

    if (!user || !(await user.comparePassword(password))) {
      await bcrypt.compare(password, dummyHash); // always takes similar time
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 404));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// logout user
router.post(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const token  = req.token;
      if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
      }
  
      const userId = req.user._id;
      const blacklistedToken = new BlackListToken({ token, userId });
      await blacklistedToken.save();

      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return next(ErrorHandler(error.message, 500));
    }
  })
);
//
module.exports = router;

/*
[
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Name cannot exceed 50 characters")
      .escape(),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail()
      .custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email already exists");
        }
      }),
      body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .withMessage('Password must contain at least one uppercase, one lowercase, one number and one special character'),

    body('confirmPassword')
      .trim()
      .notEmpty().withMessage('Please confirm your password')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),

      body('avatar').custom((value, { req }) => {
        if (!req.file) {
          throw new Error('Avatar image is required');
        }
        return true;
      })
  ],
*/
