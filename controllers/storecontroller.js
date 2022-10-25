const express = require('express')
const User = require('../models/userModel')
const Store = require('../models/storeModel')
const bcrypt = require('bcryptjs')

//Get All Stores
exports.get_stores = async (req,res,next)=>{
    const stores = await Store.find()

    if(stores.length==0)
    {
        res.status(200).json({
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
    const store = await Store.findOne({_id:req.params.storeId})

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
        store
    })
}

//Modify a store
exports.update_stores = (req,res,next)=>{
   
}

//Delete a store
exports.delete_stores = async(req,res,next)=>{
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
        await Store.findByIdAndDelete(req.params.storeId)

        res.status(204).json({
            status:'Success',
            message:'Store Deleted'
        })
    }
}