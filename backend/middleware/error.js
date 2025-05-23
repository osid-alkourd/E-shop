const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again letter`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expired
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    err = new ErrorHandler(message, 400);
  }

  if (err.message === "Only image files are allowed!") {
    return res.status(422).json({ error: err.message }); // 400 = Bad Request
  }

  // Specific Multer errors
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res
      .status(422)
      .json({ error: "Too many images uploaded. Max is 5 images." });
  }

  res.status(err.statusCode).json({
    success: false,
    error: {
      // code: err.errorCode || "INTERNAL_SERVER_ERROR",
      message: err.message,
    },
  });
};
