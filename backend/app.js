// app.js

const express = require("express");
const connectDB = require("./db/database");
// const ErrorHandler = require('./utils/ErrorHandler')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const user = require("./controller/userController");
const errorMiddleware = require("./middleware/error");
const shopRoutes = require('./routes/shopRoutes')
const productRoutes = require('./routes/productRoutes');
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // REQUIRED for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  // exposedHeaders: ['set-cookie'],
  // preflightContinue: false, // Critical
  // optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
// app.options(/(.*)/, (req,res) => {
//   res.header('Access-Control-Allow-Origin', corsOptions.origin);
//   res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
//   res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(204);
// });
// app.use((req, res, next) => {
//   res.header('X-Content-Type-Options', 'nosniff');
//   res.header('X-Frame-Options', 'DENY');
//   next();
// });
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // 👈 your frontend
  res.header("Access-Control-Allow-Credentials", "true");             // 👈 allow cookies
  res.header("Access-Control-Allow-Headers", "Content-Type");         

  // If it's a preflight request, respond immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next(); // Move to next middleware
});
// Add this middleware for all requests
app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/",express.static("uploads"))

app.use(bodyParser.urlencoded({ extended: true })); // For forms

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}
connectDB();
app.use("/api/v2/user", user);
app.use("/api/v2", shopRoutes);
app.use("/api/v2",productRoutes);


app.use(errorMiddleware);
module.exports = app;
