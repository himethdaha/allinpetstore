const express = require('express')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//Signup User POST
exports.signup_post= async (req,res,next)=>{
    try {
    //Create new User object
    const user = await User.create({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        address:req.body.address,
        state:req.body.state,
        postal_code:req.body.postal_code,
        role:req.body.role
    })
    //Create a jwt
    const jwtoken = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXP
    })
    //Send a response with the jwt
    res.status(201).json({
        status:'User Created',
        jwtoken,
        data:{
            email:req.body.email,
            role:req.body.role
        }
    })
    } catch (error) {
       res.send(error)
    }
    
}

//Login User POST
exports.login_post=async(req,res,next)=>{
    try {
    //Get user email and password from req body
    const email = req.body.email;
    const password = req.body.password;

    //If user entered the email and password 
    if(!email || !password)
    {
       return next(new Error('Email or password is empty'))
    }
    console.log(email,password)
    //Get the user based on the email
    const user = await User.findOne({email}).select('+password')
    console.log(user)
    //If no user or incorrect password
    if(user===null || !await bcrypt.compare(password,user.password))
    {
        return next(new Error(`Email or Password is incorrect`))
    }
        //Create jwt
        const jwtoken = jwt.sign({id:user._id}, process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXP
        })
        //Send a response with the jwt
        res.status(200).json({
            status:'Success',
            message:'Logged in',
            data:{
                email:email,
                jwtoken
            }
        })
    } catch (error) {
        res.send(error)
    }
    

}

//Forgot Password POST
exports.forgot_password=async(req,res,next)=>{
    //Get user email from request body
    const user = await User.findOne({email:req.body.email})
    //Check if user email exists
    if(user===null)
    {
        return next(new Error(`Incorrect email or no user with the email`))
    }
    //Generate token to be sent to the users email
    const resetToken = user.passwordResetToken()
    await user.save({validateBeforeSave:false})
    //Send the token
    res.status(200).json({
        resetToken
    })
}

//Reset Password POST
exports.reset_password=(req,res,next)=>{
    
}