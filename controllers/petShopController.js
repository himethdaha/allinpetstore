const express = require('express')
const petShop = require('../models/petShopModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const func = require('../utilities/filterFunction')
const APIFeatures = require('../utilities/APIFeatures')
const { json } = require('express')
const petShopModel = require('../models/petShopModel')
const { findById } = require('../models/userModel')

//GET all petshops
exports.get_petShops = async(req,res,next)=>{

  const queries = new APIFeatures(petShop.find(),req.query).filter().sort().limitFields().pagination()

  //Get all petshops in the db
  const petShops = await queries.query

  if(petShops.length == 0)
  {
    res.status(204).json({
        status:'Success',
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
    const petShops = await petShop.findOne({_id:req.params.petShopId}).populate('review')

    //If there's no petshop to be found
    if(petShops===null)
    {
        res.status(400).json({
            status:'Fail',
            message:'Incorrect pet shop Id or pet shop does not exist'
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
    try {
    //Get the fields from the request body
    const newpetShop = await petShop.create({
        petShop_name:req.body.petShop_name,
        description:req.body.description,
        owner:req.user._id,
        address:req.body.address,
        state:req.body.state,
        postal_code:req.body.postal_code,
        shopLocation:req.body.shopLocation
    })

    return res.status(201).json({
        status:'Success',
        message:'Pet shop created',
        newpetShop
    })
    } catch (error) {
        //For duplicate store names
        if(error.code === 11000)
        {
            return res.status(400).json({
                status:'Fail',
                message:'Can not have pet shop names conflicting with other pet shop names'
            })
        }  
        // For validation errors
        if(error.name === 'ValidatorError')
        {
            return res.status(400).json({
                status:'Fail',
                message:`${error.message}`
            })
        }  
        console.log(error)   
    }
   

}
//PATCH pet shop
exports.update_petShop = async(req,res,next)=>{
    try {
        const petShop = await petShopModel.findById(req.params.petShopId)

        //Get user from req
        const user = await User.findById(req.user)
    
        //If the user is the owner of the pet shop
        if(petShop.owner._id.toString() !== user._id.toString())
        {
           return res.status(401).json({
               status:'Fail',
               message:'You do not have permission'
           })
        }
        //Function to filter fields
        const filteredFields = func.filterFunction(req.body, 'petShop_name','description','address','state','postal_code','shopLocation')
    
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
            const updatedPetShop = await petShopModel.findByIdAndUpdate(petShop._id,filteredFields,{new:true,runValidators:true})
    
            res.status(200).json({
                status:'Success',
                message:'Data updateed',
                updatedPetShop
            })
        }
    } catch (error) {
        //For duplicate store names
        if(error.code === 11000)
        {
            res.status(400).json({
                status:'Fail',
                message:'Can not have pet shop names conflicting with other pet shop names'
            })
        }
        //For validation errors
        if(error.name === 'ValidatorError')
        {
            res.status(400).json({
                status:'Fail',
                message:error.message
            })
        }  
    }

}
//DELETE pet shop
exports.delete_petShop = async(req,res,next)=>{
     //Get user by id and password
     const user = await User.findOne({_id:req.user._id}).select('+password')
     const petShop = await petShopModel.findById(req.params.petShopId) 
 
     //If the user is the owner of the pet shop
     if(petShop.owner._id.toString() !== user._id.toString())
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
        await petShop.findByIdAndDelete(req.params.petShopId)
 
        res.status(204).json({
            status:'Success',
            message:'Pet Shop Deleted'
        })
     }
}

//To get pet shops within a certain distance
exports.get_petShops_distance = async(req,res,next) =>{

    try {
        //Get location from browser if user allows it
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(position){

                let lat =  position.coords.latitude
                let lng =  position.coords.longitude
            })
        }
        lat = req.params.lat
        lng = req.params.lng

        //If users location isn't given
        if(!lat || !lng)
        {
            return res.status(400).json({
                status:'Fail',
                message:'Please allow location access in your browser or provide longitudinal and latitudinal values of your current location'
            })
        }
              
        //Get values required from req.params
        const {distance,unit} = req.params

        //Radian
        const radius = unit === 'mi' ? distance/3963 : distance/6378

        //Find the petshops based on the params
        const petShops = await petShopModel.find({shopLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}})

        res.status(200).json({
            status:'Success',
            petShops
        })

    } catch (error) {
        res.status(404).json({
            status:'Fail',
            message:'An error occured'
        })
    }
   
}

//To calculate the distances to all petshops from the users location
exports.getAll_distances = async(req,res,next) =>{
    try {
        //Get location from browser if user allows it
        // if(navigator.geolocation)
        // {
        //     navigator.geolocation.getCurrentPosition(function(position){

        //         let lat =  position.coords.latitude
        //         let lng =  position.coords.longitude
        //     })
        // }
        let lat = req.params.lat
        let lng = req.params.lng

        //If users location isn't given
        if(!lat || !lng)
        {
            return res.status(400).json({
                status:'Fail',
                message:'Please allow location access in your browser or provide longitudinal and latitudinal values of your current location'
            })
        }

        //Get unit from params
        const {unit} = req.params
        const distMultiplier = unit === 'mi' ? 0.00062137 : 0.001

        const petShops = await petShopModel.aggregate([
                {
                    $geoNear:{
                        near:{
                            type:'Point',
                            coordinates:[Number(lng), Number(lat)]
                        },
                        distanceField:'distance' ,
                        distanceMultiplier:distMultiplier,
                        spherical:true
                    }
                },
                {
                    $addFields:{
                        petshop_name:'$_id'
                    }
                },
                {
                    $project:{
                        petShop_name:1,
                        distance:1,
                        _id:0
                    }
                },
                {
                    $sort:{
                        distance:1
                    }
                }
        ])
        
        res.status(200).json({
            status:'Success',
            petShops
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status:'Fail',
            message:'An error occured',
            error
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
