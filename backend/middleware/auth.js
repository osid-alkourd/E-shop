const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const BlackListToken = require("../model/blackListToken");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const blacklistedToken = await BlackListToken.findOne({ token });
    if (blacklistedToken) {
      return next(new ErrorHandler("token is back listed", 401));
    }
    req.user = await User.findById(decode.id);
    req.token = token;
    next();
  } catch (error) {
    return next(
      new ErrorHandler("Invalid or expired token. Please login again.", 401)
    );
  }
});
