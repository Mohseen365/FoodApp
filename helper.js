var jwt = require("jsonwebtoken");
const {JWT_KEY} = require('./secrets');
const userModel = require('./models/userModel');

module.exports.protectRoute = async function (req, res, next) {
  let token;
  if (req.cookies.login) {
    token = req.cookies.login; // we are taking token from user browser
    let payloadObj = jwt.verify(token, JWT_KEY);
    // console.log('payloadObj  : ', payloadObj );
    const user = await userModel.findById(payloadObj.payload);
    req.id = user.id;
    req.role = user.role;
    if (payloadObj ) {
      next();
    }
    
  }
  else {
    res.json({
      msg: "Operation not allowed"
    })
  }
}

//isAutorised-? check the user's role
// client will send role key in req obj
module.exports.isAuthorised = function (roles) {
  return function (req, res, next) {
    let role = req.role;
    if (roles.includes(role)) {
      next();
    } else {
      res.status(401).json({
        msg: "Invalid Role Operation not required"
      });
    }
  }
}