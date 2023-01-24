const express = require('express');
const userModel = require('../models/userModel')

var jwt = require("jsonwebtoken");
const {JWT_KEY}=require('../secrets'); 

const authRouter = express.Router();

// authRouter
//   .route('/signup')
//   .get(getSignup)
//   .post(postSignup)

// authRouter
//   .route('/login')
//   .post(loginUser)

// function getSignup(req, res) {
//   res.sendFile("/public/index.html", {root: __dirname});
//   // console.log('get axios');
// }


module.exports = authRouter;