const express = require('express')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendMail = require('../utilities/emailer')
const func = require('../utilities/filterFunction')
const { json } = require('express')

//Sign JWT function
const signJWT = (userId,res) =>{
    const jwtoken = jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXP
    })
    
    //Send jwt with a cookie
    res.cookie('jwt',jwtoken,{
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXP * 60 * 60 * 1000),
        httpOnly:true
    })
    return jwtoken
}

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
    const jwtoken = signJWT(user._id,res)

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
        res.status(400).json({
        status:'Fail',
        message:'Empty email or password'
       })
    }
    //Get the user based on the email
    const user = await User.findOne({email}).select('+password')

    //If no user 
    if(user===null)
    {
        res.status(400).json({
            status:'Fail',
            message:'Incorrect email/password or user does not exist'
        })
    }

    //If incorrect password
    if(user && !await bcrypt.compare(password,user.password))
    {
        //Increment user login attempts
        user.userLoginAttempts += 1
        await user.save({validateBeforeSave:false})
     
        //Check Login attempts
        if(user.userLoginAttempts > process.env.USER_LOGIN_COUNTER)
        {
            //Add 30 mins to user login expiration time
            user.userLoginExpire = new Date(Date.now() + 30 * 60 * 1000)
            //Reset login attempts counter
            user.userLoginAttempts = 0
            await user.save({validateBeforeSave:false})
            return res.status(403).json({
                status:'Fail',
                message:'Exceeded Login attempts. Try again in 30 mintues'
            })
        }

        return res.status(400).json({
            status:'Fail',
            message:'Incorrect email/password or user does not exist'
        })

    }

    //If the user has exceeded login limit
    if(user.userLoginExpire > new Date(Date.now()))
    {
        return res.status(400).json({
            status:'Fail',
            message:`Exceeded Login attempts. Try again in ${((user.userLoginExpire-new Date(Date.now()))/60000).toFixed(0)} minitues`
        })
    }

    //If everything is fine
    if(user.userLoginAttempts < process.env.USER_LOGIN_COUNTER && user.userLoginExpire < new Date(Date.now()))
    {
        //Reset login attempts counter
        user.userLoginAttempts = 0
        await user.save({validateBeforeSave:false})
        //Create jwt
        const jwtoken = signJWT(user._id,res)
        //Send a response with the jwt
        res.status(200).json({
            status:'Success',
            message:'Logged in',
            data:{
                email:email,
                jwtoken
            }
        })
    }
        
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
    const jwtoken = signJWT(user._id,res)

    res.status(200).json({
        status:'Success',
        message:'Password reset',
        jwtoken,
    })
}

//GET user information
exports.get_user = async(req,res,next) =>{
    //Get the id from req.user passed down from authenticate middleware
    const user = await User.findById(req.user._id)

    res.status(200).json({
        status:'Success',
        user
    })
}


exports.update_user = async(req,res,next) =>{
    //Get the user by req.user
    const user = await User.findById(req.user._id)
    //Function to filter fields
    const filteredFields = func.filterFunction(req.body, 'first_name','last_name','email','address','state','postal_code')

    //If the request body contains password fields
    if(req.body.password || req.body.passwordConfirm)
    {
        res.status(400).json({
            status:'Fail',
            message:'You can not update passwords here'
        })
    }
    else
    {
        const updatedUser = await User.findByIdAndUpdate(user.id,filteredFields,{new:true,runValidators:true})

        res.status(200).json({
            status:'Success',
            message:'Data updateed',
            updatedUser
        })
    }

}
exports.delete_user = async(req,res,next) =>{
    //Get the user
    const user = await User.findOne({_id:req.user._id}).select('+password')
    //Get the password from req body
    const password = req.body.password

    //If password is not correct
    if(!await bcrypt.compare(password,user.password))
    {
        res.status(401).json({
            status:'Fail',
            message:'Incorrect passoword'
        })
    }
    //If password is correct
    if(await bcrypt.compare(password,user.password))
    {
        //If password is correct, delete user
        await User.findByIdAndDelete(req.user._id)

        res.status(204).json({
            status:'Success',
            message:'User deleted'
        })
    }
   
}