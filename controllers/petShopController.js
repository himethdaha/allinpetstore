const express = require('express')
const petShop = require('../models/petShopModel')

//GET all petshops
exports.get_petShop = async(req,res,next)=>{
  //Get all petshops in the db
  const petShops = await petShop.find()

  if(petShops.length == 0)
  {
    res.status(400).json({
        status:'Fail',
        message:'Could not find any pet stores'
    })
  }
  else
  {
    res.status(200).json({
        status:'Success',
        petShops
    })
  }

  
}
//GET pet shop based on id
exports.get_petShop = async(req,res,next)=>{
    //Get the pet shop id from url params
    const petShop = await petShop.findOne({_id:req.params.petShopId})

    //If there's no petshop to be found
    if(petShop===null)
    {
        res.status(400).json({
            status:'Fail',
            message:'Pet shop can not be found'
        })
    }
    else
    {
        res.status(200).json({
            status:'Success',
            petShop
        })
    }


}
//POST (create) pet shop
exports.create_petShop = async(req,res,next)=>{
    //Get the fields from the request body
    const newpetShop = await petShop.create({
        petShop_name:req.body.petShop_name,
        description:req.body.description,
        owner:req.body.owner,
        address:req.body.address,
        state:req.body.state,
        postal_code:req.body.postal_code
    })

    res.status(201).json({
        status:'Success',
        message:'Pet shop created',
        newpetShop
    })

}
//PATCH pet shop
exports.update_petShop = async(req,res,next)=>{

}
//DELETE pet shop
exports.delete_petShop = async(req,res,next)=>{

}