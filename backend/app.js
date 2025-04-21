// app.js

const express = require('express');
const connectDB = require('./db/database');
// const ErrorHandler = require('./utils/ErrorHandler')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require('cors')
const user = require('./controller/userController')
const errorMiddleware = require('./middleware/error');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/",express.static("uploads"))

app.use(bodyParser.urlencoded({ extended: true })); // For forms

if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({
     path: "backend/config/.env"
    })
}
connectDB()
app.use("/api/v2/user", user);

app.use(errorMiddleware);
module.exports = app;

