const express = require('express');
const userRouter = express.Router();

const {protectRoute, isAuthorised} = require('../helper');
const {getUser, allUser, updateUser, deleteUser} = require('../controller/userController');
const {signup, forgetpassword, resetpassword, login, logout} = require('../controller/authController')


userRouter
  .route('/signup')
  .post(signup)

userRouter
  .route('/login')
  .post(login)

userRouter
  .route('/forgetpassword')
  .post(forgetpassword)

userRouter
  .route('/resetpassword/:token')
  .post(resetpassword);

userRouter
.route('/logout')
.get(logout)
//options for user
userRouter    
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser)

  //profile page
userRouter.use(protectRoute);
userRouter
  .route('/profile')
  .get(getUser);



  //admin specific function
userRouter.use(isAuthorised(['admin'])); //error aayi thi because isAut.. me () lagana bhul gya tha
userRouter
  .route('/')
  .get(allUser)



module.exports = userRouter;