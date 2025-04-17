// app.js

const express = require('express');
const connectDB = require('./db/database');
const ErrorHandler = require('./utils/ErrorHandler')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // For forms

if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({
     path: "backend/config/.env"
    })
}
// connectDB()
app.use(ErrorHandler);
module.exports = app;

