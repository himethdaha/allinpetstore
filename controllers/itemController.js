const express = require('express')
const itemModel = require('../models/itemModel')

//GET all items
exports.get_item = async(req,res,next)=>{
    //Get all items in the db
    const items = await itemModel.find().populate('store_name')

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

}
//DELETE item
exports.delete_item = async(req,res,next)=>{

}