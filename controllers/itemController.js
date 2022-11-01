const express = require('express')
const itemModel = require('../models/itemModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const func = require('../utilities/filterFunction')
const APIFeatures = require('../utilities/APIFeatures')


//GET all items
exports.get_item = async(req,res,next)=>{

    const queries = new APIFeatures(itemModel.find(),req.query).filter().sort().limitFields().pagination()

    //Get all items in the db
    const items = await queries.query.populate('store_name')

    if(items.length == 0)
    {
        res.status(400).json({
            status:'Fail',
            message:'Could not find any items'
        })
    }
    else
    {
        res.status(200).json({
            status:'Success',
            items
        })
    }
}
//GET item based on id
exports.get_item = async(req,res,next)=>{
    //Get the item id from url params
    const item = await itemModel.findOne({_id:req.params.itemId}).populate('store_name')

    //If there's no item to be found
    if(item===null)
    {
        res.status(400).json({
            status:'Fail',
            message:'Item can not be found'
        })
    }
    else
    {
        res.status(200).json({
            status:'Success',
            item
        })
    }
}
//POST (create) item
exports.create_item = async(req,res,next)=>{
    const item = await itemModel.create({
        item_name:req.body.item_name,
        store_name:req.body.store_name,
        description:req.body.description,
        price:req.body.price,
        quantity:req.body.quantity,
    })
    res.status(201).json({
        status:'Success',
        message:'Item created',
        item
    })
}
//PATCH item
exports.update_item = async(req,res,next)=>{
     //Get the user by req.user
     const user = await User.findById(req.user._id)
     //Function to filter fields
     const filteredFields = func.filterFunction(req.body, 'item_name','description','price','quantity')
 
     //If the request body contains store name field
     if(req.body.store_name)
     {
         res.status(400).json({
             status:'Fail',
             message:'You can not update the store name here. Please contact our customer services'
         })
     }
     else
     {
         const updatedStore = await User.findByIdAndUpdate(user.id,filteredFields,{new:true,runValidators:true})
 
         res.status(200).json({
             status:'Success',
             message:'Data updateed',
             updatedStore
         })
     }
}
//DELETE item
exports.delete_item = async(req,res,next)=>{
 //Get user by id and password
 const user = await User.findOne({_id:req.user._id}).select('+password')
 //Check for password confirmation
 if(!(await bcrypt.compare(req.body.password,user.password)))
 {
     res.status(401).json({
         status:'Fail',
         message:'Incorrect password'
     })
 }
 if(await bcrypt.compare(req.body.password,user.password))
 {
    await itemModel.findByIdAndDelete(req.params.itemId)

    res.status(204).json({
        status:'Success',
        message:'Item Deleted'
    })
 }
}

exports.get_most_expensive = async(req,res) =>{

    let itemCategory = req.params.category
    console.log(itemCategory)
        const items = await itemModel.aggregate([
            {
                $match:{
                    type:itemCategory
                }
            },
            {
                $group:{
                    _id:'$item_name',
                    price:{$max:'$price'}
                    
                }
            },
            {
                $addFields:{
                    name:'$_id'
                }
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{
                    price:-1
                }
            }
            
        ])
        if(items.length === 0 )
        {
            res.status(200).json({
                status:'Fail',
                message:'Could not find any results'
            }) 
        }
        else
        {

            res.status(200).json({
                status:'Success',
                items
            })   
        }
}

exports.item_ratings = async(req,res,next)=>{

    try {
        let items =  await itemModel.aggregate([
            {
                $group:
                {
                    _id: '$item_name',
                    totRatingsAvg:{$avg:'$avgRatings'},
                    totRatings:{$sum:'$noOfRatings'},
                }
            },
            {
                $sort: {totRatingsAvg:-1}
            }
        ])
    
        res.status(200).json({
            status:'Success',
            items
        })
    } catch (error) {
        res.status(404).json({
            status:'Fail',
            message:'Can not find results'
        })
    }
}
