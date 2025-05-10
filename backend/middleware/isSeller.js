const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Shop = require("../model/shop");
// const BlackListToken = require("../model/blackListToken");

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  try {
    const decode = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
    // const blacklistedToken = await BlackListToken.findOne({ token });
    // if (blacklistedToken) {
    //   return next(new ErrorHandler("token is back listed", 401));
    // }
    req.shop = await Shop.findById(decode.id);
    req.seller_token = seller_token;
    next();
  } catch (error) {
    return next(
      new ErrorHandler("Invalid or expired token. Please login again.", 401)
    );
  }
});
