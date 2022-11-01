const express = require('express')
const petShop = require('../models/petShopModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const func = require('../utilities/filterFunction')
const APIFeatures = require('../utilities/APIFeatures')
const { json } = require('express')

//GET all petshops
exports.get_petShops = async(req,res,next)=>{

  const queries = new APIFeatures(petShop.find(),req.query).filter().sort().limitFields().pagination()

  //Get all petshops in the db
  const petShops = await queries.query

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
    const petShops = await petShop.findOne({_id:req.params.petShopId})

    //If there's no petshop to be found
    if(petShops===null)
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
            petShops
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
     //Get the user by req.user
     const user = await User.findById(req.user._id)
     //Function to filter fields
     const filteredFields = func.filterFunction(req.body, 'petShop_name','description','address','state','postal_code')
 
     //If the request body contains owner field
     if(req.body.owner)
     {
         res.status(400).json({
             status:'Fail',
             message:'You can not update owner here. Please contact our customer services'
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
//DELETE pet shop
exports.delete_petShop = async(req,res,next)=>{
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
        await petShop.findByIdAndDelete(req.params.petShopId)
 
        res.status(204).json({
            status:'Success',
            message:'Pet Shop Deleted'
        })
     }
}


exports.petShop_ratings = async(req,res,next)=>{

    try {
        let shops =  await petShop.aggregate([
            {
                $group:
                {
                    _id: '$petShop_name',
                    totRatingsAvg:{$avg:'$Rating'},
                    totRatings:{$sum:'$noOfRatings'},
                }
            },
            {
                $sort: {totRatingsAvg:-1}
            }
        ])
    
        res.status(200).json({
            status:'Success',
            shops
        })
    } catch (error) {
        res.status(404).json({
            status:'Fail',
            message:'Can not find results'
        })
    }
}
