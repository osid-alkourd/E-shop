const error = require("../middleware/error");

class ErrorHandler extends Error {
  constructor(message, statusCode,errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
