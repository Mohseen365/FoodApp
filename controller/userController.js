const { find } = require('../models/userModel');
const userModel = require('../models/userModel')

module.exports.getUser = async function (req, res) {
  try {
    const id = req.id;
    let user = await userModel.findById(id)
    
    res.json({ msg: "user retrieved", user });
  } catch (err) {
    res.json({
      msg: err.message,
    });
  }
  
}


module.exports.allUser = async function (req, res) {
  
  try {
    let users = await userModel.find()
    res.json({   
      "message": "All Users are Retrieved",
      "allUsers": users
    })
  } catch (err) {
    res.json({
      msg: err.message,
    });
  }
}




module.exports.updateUser = async function (req, res) {
  
  try {
    const id = req.params.id;
    const dataToBeUploaded = req.body;
    const user = await userModel.findById(id);
    if (user) {
      keys = [];
      for(key in dataToBeUploaded) {
        user[key] = dataToBeUploaded[key];
      }
      res.json({
        "message" : "Data updated",
        "user": user
      })
    } else {
      res.json({
        "message" : "User not found"
      })
    }
    
   
    
  } catch (err) {
    res.json({
      msg: err.message,
    });
  }
}


module.exports.deleteUser = async function (req, res) {
  try {
    const id = req.params.id
    let user = await userModel.findByIdAndDelete(id)
    res.json({   
      "message": "User is Deleted",
      "user": user
    }) 
  } catch (err) {
    
  }
      
}






  
// module.exports.setCookies = function (req, res) {
//   res.cookie('isLoggedIn', true, {maxAge: 10000, secure:true}); //maxage is in milliseconds, secure means https
//   res.cookie('password', 1234567890, {secure:true});
//   res.send('cookies has been send');
// }

// module.exports.getCookies = function (req, res) {
//   let cookies = req.cookies;
//   console.log('OUTPUT : ', req.cookies.password);
//   console.log('req.cookies : ', cookies);
//   console.log('req.cookie : ', req.cookie);

//   res.send('Cookies received');
// }