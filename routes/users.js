const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/usercontroller');
const router = express.Router();

//Signup Users
router.post('/signup',userController.signup_post);

//Login Users
router.post('/login',userController.login_post);

//Forgot Password
router.post('/forgotPassword',userController.forgot_password);
//Reset Password
router.patch('/resetPassword/:resetToken',userController.reset_password);

//For the below actions the user must be logged in
router.use(authController.authenticateRoutes)

//To PATCH password
router.patch('/updateUser',userController.update_user);
//To GET user information
router.get('/userInformation',userController.get_user);
//To DELETE user
router.delete('/deleteUser',userController.delete_user);

module.exports = router;
