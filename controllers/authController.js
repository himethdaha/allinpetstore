const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

//Authorize routes
exports.authorizeRoute = async(req,res,next)=>{
    let token;
    let decoded;
    //Check if jwt exists
    //Check if authorization header is present
    if(!req.headers.authorization)
    {
        return res.status(401).json({
            status:'Fail',
            message:`You don't have access.Please log in`
        })
    }
    //If authorization header is found, check for token
    if(req.headers.authorization)
    {
        token = req.headers.authorization.split(' ')[1]
    }
    //If no token is found
    if(!token)
    {
        return res.status(401).json({
            status:'Fail',
            message:`You don't have access.Please log in`
        })
    }
    //Check if jwt is valid and not expired
    try {
         decoded = jwt.verify(token,process.env.JWT_SECRET)
         console.log(decoded)
    } catch (error) {
        return res.status(401).json({
            status:'Fail',
            message:`You don't have access.Please log in`
        }) 
    }

    //Check if user exists
    const user = await User.findById(decoded.id)
    if(user===null)
    {
        return res.status(400).json({
            status:'Fail',
            message:`User does not exist`
        })
    }

    //Check if password isn't changed after jwt is issued
    if(parseInt(user.passwordChangeTime.getTime()/1000) > decoded.iat)
    {
        return res.status(401).json({
            status:'Fail',
            message:'Password was changed.Please log in'
        })
    }
    next( )
}