const express = require('express')
const Review = require('../models/reviewsModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const func = require('../utilities/filterFunction')
const APIFeatures = require('../utilities/APIFeatures')

//GET all reviews
exports.getReviews = async(req,res)=>{
    //Get all reviews based on any query strings
    const queries = new APIFeatures(Review.find(),req.query).sort().pagination()

    //Save the returned query 
    const reviews = await queries.query
    if(reviews.length === 0)
    {
        res.status(204).json({
            status:'Success',
            message:'No reviews to be found'
        })
    }
    else
    {
        res.status(200).json({
            status:'Success',
            reviews
        })
    }

}

//GET review based on ID
exports.getReview = async(req,res)=>{

    //Get review Id from url param
    const review = await Review.findById(req.params.reviewId)

    if(review===null)
    {
        res.status(400).json({
            status:'Fail',
            message:'Incorrect review Id or review does not exist'
        })
    }
    else
    {
        res.status(200).json({
            status:'Success',
            review
        })
    }
}

//POST new review
exports.create_Review = async(req,res) =>{
    try {
        let review;
        if(req.params.storeId)
        {
            review = await Review.create({
                title : req.body.title,
                description : req.body.description,
                user : req.user._id,
                store : req.params.storeId
            })
        }
        else if(req.params.petShopId)
        {
            review = await Review.create({
                title : req.body.title,
                description : req.body.description,
                user : req.user._id,
                petShop : req.params.petShopId
            })
        }
        else if(req.params.itemId)
        {
            review = await Review.create({
                title : req.body.title,
                description : req.body.description,
                user : req.user._id,
                item:req.params.itemId
            })
        }
        
    
        res.status(201).json({
            status:'Success',
            message:'Review created',
            review
        })
    } catch (error) {
        //If duplicate reviews from the same user exists
        if(error.code === 11000)
        {
            return res.status(400).json({
                status:'Fail',
                messsage:'Can not create another review for the same store or item'
            })
        }
        //For validation errors
        if(error.errors.title.name === 'ValidatorError')
        {
            res.status(400).json({
                status:'Fail',
                message:`${error.errors.title.message}`
            })
        }
       
    }
    
}

//DELETE review
exports.delete_Review = async(req,res) =>{
    //Get review from url param
    const review = await Review.findById(req.params.reviewId)

    if(review === null)
    {
        return res.status(400).json({
            status:'Fail',
            message:'Incorrect review Id or review does not exist'
        })
    }
    //Get user from req
    const user = await User.findById(req.user)
 
    //If the user is the owner of the review
    if(review.user._id.toString() !== user._id.toString())
    {
        return res.status(401).json({
            status:'Fail',
            message:'You do not have permission'
        })
    }

    //Get password from the request body
    const password = req.body.password
    //Validate password 
    if(!password || !await bcrypt.compare(password,user.password))
    {
        return res.status(401).json({
            status:'Fail',
            message:'Incorrect or empty password'
        })
    }
    if(await bcrypt.compare(password,user.password))
    {
        //Delete review
        await Review.findByIdAndDelete(review)

        return res.status(204).json({
            status:'Success',
            message:'Review deleted'
        })
    }
    
    
}

//UPDATE a review
exports.update_Review = async(req,res) =>{

    try {
        //Get review Id from url params
        const review = await Review.findById(req.params.reviewId)

        if(review === null)
        {
            return res.status(400).json({
                status:'Success',
                message:'Incorrect review Id or review does not exist'

            })
        }

        //Get user from req
        const user = await User.findById(req.user)
    
        //If the user is the owner of the review
        if(review.user._id.toString() !== user._id.toString())
        {
            return res.status(401).json({
                status:'Fail',
                message:'You do not have permission'
            })
        }

        if(req.body.user)
        {
            return res.status(400).json({
                status:'Fail',
                message:'You can not update user'
            })
        }

    //Function to filter fields
    const filteredFields = func.filterFunction(req.body, 'title','description')

    const updatedReview = await Review.findByIdAndUpdate(review._id,filteredFields,{new:true,runValidators:true})
 
        return res.status(200).json({
             status:'Success',
             message:'Data updateed',
             updatedReview
        })
    } catch (error) {
        //For validation errors
        if(error.errors.title.name === 'ValidatorError')
        {
            res.status(400).json({
                status:'Fail',
                message:`${error.errors.title.message}`
            })
        }
    }

}