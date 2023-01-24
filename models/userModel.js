const mongoose = require('mongoose');
const {db_link} = require('../secrets');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require("uuid");

mongoose.connect(db_link)
    .then(function (db) {
        console.log("User db connected");
        // console.log(db);
    })
    .catch(function (err) {
        console.log(err);
    });


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Schema request jane se pehle hi validate kr lega agar mongo db me validate krvate to request chli jati fir vo error thorw krta 
    validate: function () {
      return emailValidator.validate(this.email);
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  confirmPassword: {
    type: String,
    // required: true,
    minLength: 7,
    validate: function () {
      this.confirmPassword == this.password;
    }
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'restaurantowner', 'deliveryboy'], //checks if the value is given in an array
    default: 'user'
  },
  profileImage: {
    type: String,
    default: 'img/users/default.img'
  },
  resetToken: {type: String}
});

//hooks

userSchema.pre('save', function () {
  console.log('before saving in database pre hook');
  this.confirmPassword = undefined;
})

// userSchema.pre('save', async function () {
//   let salt = await bcrypt.genSalt();
//   console.log('salt : ', salt);
//   let hashedString = await bcrypt.hash(this.password, salt);
//   this.password = hashedString;
//   console.log('hashedString : ', hashedString);

// })

// userSchema.post('save', function() {
//   console.log('after saving in database post hook');
// })

userSchema.methods.createResetToken = async function () {
  const resetToken = uuidv4();
  this.resetToken = resetToken;
  // this.confirmPassword = this.password;
  await this.save();
  return resetToken;
}

userSchema.methods.resetPasswordHandler  = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.resetToken = undefined;
}

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel