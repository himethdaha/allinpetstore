const express = require('express')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendMail = require('../utilities/emailer')

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
       return res.status(400).json({
        status:'Fail',
        message:'Empty email or password'
       })
    }
    //Get the user based on the email
    const user = await User.findOne({email}).select('+password')
    console.log(user)
    //If no user or incorrect password
    if(user===null || !await bcrypt.compare(password,user.password))
    {
        return res.status(400).json({
            status:'Fail',
            message:'Incorrect email/password or user does not exist'
        })
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
    const email = req.body.email
    //Get user email from request body
    const user = await User.findOne({email})
    //Check if user email exists
    if(user===null)
    {
        return next(new Error(`Incorrect email or no user with the email`))
    }
    //Generate token to be sent to the users email
    const resetToken = user.passwordResetToken()
    await user.save({validateBeforeSave:false})

    //Create resetpassword url with the resetoken
    const resetTokenUrl = `${req.protocol}://${req.hostname}/users/resetPassword/${resetToken}`

    //Create email options
    try {
        sendMail({
            to:user.email,
            subject:'Password reset token',
            text:`Your password reset token is in this url ${resetTokenUrl}. This token will expire in 10 minitues. If you did not request a password reset ignore this email`
        })

        res.status(200).json({
            status:'Success',
            message:'Email sent'
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save({validateBeforeSave:false})
        return next(error )
    }

}

//Reset Password POST
exports.reset_password=async (req,res,next)=>{
    const resetToken = req.params.resetToken

    //If there is a token hash it
     const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //Get user based on resetToken
    const user = await User.findOne({resetPasswordToken:hashToken})
    console.log(user)
    //Check if resetToken hasn't expired and user exists
    if(user===null)
    {
        return res.status(400).json({
            status:'Fail',
            message:`Invalid token or password token has expired`
        })
    }

    //Update password of user
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined 
    await user.save()

    //Log in the user
    const jwtoken = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXP
    })

    res.status(200).json({
        status:'Success',
        message:'Password reset',
        jwtoken,
    })
}