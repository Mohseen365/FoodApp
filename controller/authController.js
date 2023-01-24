const userModel = require('../models/userModel')
var jwt = require("jsonwebtoken");
const {JWT_KEY} = require('../secrets'); 
const {sendMail} = require('../utility/nodemailer'); 

module.exports.signup = async function  (req, res) {
  // let {email, name, password} = req.body;
  try {
    console.log(req.body); //backend log will show in terminal
  let data = req.body;
  console.log('in signup start');
  //pre hook will be called
  let user = await userModel.create(data);
  // post hook will be called

  if (user) {
    await sendMail("signup", user);
    res.json({
      message: "User Signed Up",
      user     
    });
  } else {
    res.json({
      msg: "user could not be signed up"
    });
  }
  
  } catch (err) {
    res.json({
      err:err.message
    })
  }
}

module.exports.login = async function (req, res) {
  try {
    let {email, password} = req.body;
    let user = await userModel.findOne({email: email});
    if (user) {
      //bcrypt - compare 
      if (password == user.password) {
        let uid = user["_id"]; //unique id used to make token
        let token = jwt.sign({payload: uid}, JWT_KEY); // we had made token and we will give it to users so that we can uniquely recognise them later
        res.cookie('login', token); // give token to user
        res.json({
          msg: "Successful login"
        })
      }
      else {
        res.json({
          msg: "Wrong Credentials"
        })
      }
    }
    else {
      res.json({
        msg: "User does not exist"
      })
    }
  } catch (error) {
    res.json({
      msg: error.message
    })
  }
}

module.exports.forgetpassword = async function (req, res) {
  try {
    let email = req.body.email;
    console.log(email);
    const user = await userModel.findOne({email: email});
    if (user) {
      //resetToken
      const resetToken = await user.createResetToken();
      //create link 
      //https://xyz.com/resetPassword/resetToken
      let resetPasswordLink = `${req.protocol}://${req.get('host')}/user/resetpassword/${resetToken}`;
      // console.log('resetPasswordLink : ', resetPasswordLink);
      
      // await sendMail("signup", user);
      // console.log('sendMail : ');
      await sendMail("forgetpassword",{email,resetPasswordLink});
      res.json({
        msg:"email sent successfully"
      });
    } else {
      res.json({
        msg:'user not found'
      })
    }
  } catch (err) {
    res.status(500).json({
      msg: err.message
    });
  }
}

module.exports.resetpassword  = async function (req, res) {
  try {
    let token = req.params.token; //token in route
    let {password, confirmPassword} = req.body;
    const user = await userModel.findOne({resetToken: token});
    if (user) {
      user.resetPasswordHandler(password, confirmPassword);
      await user.save();
      res.json({
        msg: "Password changed successfully"
      });
    } else {
      res.json({
        msg: "user not found"
      })
    }
  } catch (error) {
    res.json({
      msg: error.message
    });
  }
}

module.exports.logout = function (req, res) {
  res.cookie('login', ' ', {maxAge: 1});
  res.json({
    msg: "Logged out successfully"
  })
}