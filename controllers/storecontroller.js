const express = require('express')
const User = require('../models/userModel')
const Store = require('../models/storeModel')
const bcrypt = require('bcryptjs')
const func = require('../utilities/filterFunction')
const APIFeatures = require('../utilities/APIFeatures')
const storeModel = require('../models/storeModel')

//Get All Stores
exports.get_stores = async (req,res,next)=>{

    const queries = new APIFeatures(petModel.find(),req.query).filter().sort().limitFields().pagination()

    const stores = await queries.query
    
    if(stores.length==0)
    {
        res.status(204).json({
            status:'Success',
            message:'No stores to be found'
        })
    }
    else
    {

        res.status(200).json({
            status:'Success',
            stores
        })
    }

}

//Get a store
exports.get_store = async(req,res,next)=>{
    //Get a store based on Id
    const store = await Store.findOne({_id:req.params.storeId}).populate('review')

    if(store===null)
    {
        res.status(400).json({
            status:'Fail',
            message:'Incorrect store Id or store does not exist'
        })
    }
    else
    {

        res.status(200).json({
            status:'Success',
            store
        })
    }

}

//Create a store
exports.create_stores = async(req,res,next)=>{
    try {
        const store = await Store.create({
            store_name:req.body.store_name,
            owner:req.body.owner,
            address:req.body.address,
            state:req.body.state,
            postal_code:req.body.postal_code
        })

        res.status(201).json({
            status:'Success',
            message:'Store created',
        })
    } catch (error) {
        console.log(error)
        //For duplicate store names
        if(error.code === 11000)
        {
            return res.status(400).json({
                status:'Fail',
                message:'Can not have store names conflicting with other store names'
            })
        }
    }
}

//Modify a store
exports.update_stores = async(req,res,next)=>{
    try {
    //Get the store by req.user
    const store = await Store.findById(req.params.storeId)
    //Get user from req
    const user = await User.findById(req.user)
    //If the user is the owner of the store
    if(store.owner._id.toString() !== user._id.toString())
    {
        return res.status(401).json({
            status:'Fail',
            message:'You do not have permission'
        })
    }
    //Function to filter fields
    const filteredFields = func.filterFunction(req.body, 'store_name','description','address','state','postal_code')

    //If the request body contains owner field
    if(req.body.user)
    {
        res.status(400).json({
            status:'Fail',
            message:'You can not update owner here. Please contact our customer services'
        })
    }
    else
    {
        const updatedStore = await Store.findByIdAndUpdate(store._id,filteredFields,{new:true,runValidators:true})
        res.status(200).json({
            status:'Success',
            message:'Data updateed',
            updatedStore
        })
    }
    } catch (error) {
        //For duplicate store names
        if(error.code === 11000)
        {
           return res.status(400).json({
               status:'Fail',
               message:'Can not have store names conflicting with other store names'
           })
        }
    }

}

//Delete a store
exports.delete_stores = async(req,res,next)=>{
    //Get user by id and password
    const user = await User.findOne({_id:req.user._id}).select('+password')
    const store = await Store.findById(req.params.storeId)

    //If the user is the owner of the store
    if(store.user._id.toString() !== user._id.toString())
    {
        return res.status(401).json({
            status:'Fail',
            message:'You do not have permission'
        })
    }

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
        await Store.findByIdAndDelete(req.params.storeId)

        res.status(204).json({
            status:'Success',
            message:'Store Deleted'
        })
    }
}

exports.store_ratings = async(req,res,next)=>{

    try {
        let stores =  await storeModel.aggregate([
            {
                $group:
                {
                    _id: '$store_name',
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
            stores
        })
    } catch (error) {
        res.status(404).json({
            status:'Fail',
            message:'Can not find results'
        })
    }
}