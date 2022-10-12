const express = require('express');
const userController = require('../controllers/usercontroller')
const router = express.Router();

//Signup Users
router.post('/signup',userController.signup_post);

//Login Users
router.post('/login',userController.login_post);

//Forgot Password
router.post('/forgotPassword',userController.forgot_password);
//Reset Password
router.post('/resetPassword',userController.reset_password);

module.exports = router;
