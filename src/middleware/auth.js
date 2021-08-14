require('dotenv').config();
const jwt = require("jsonwebtoken");
// const cookieParser = require('cookie-parser');
const MyModel = require("../models/collection");
// const express = require('express');
// const app = express();

// app.use(cookieParser());

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const varifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(`varifing : ${varifyUser}`);

        const user = await MyModel.findOne({_id:varifyUser._id})
        console.log(user);

        next();


    } catch (error) {
        res.status(401).send("You must be logged in or Signed in");
        console.log("error in auth.js" + error);
    }
}

module.exports = auth;