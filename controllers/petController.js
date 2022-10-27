const express = require('express')
const petModel = require('../models/petModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const func = require('./filterFunction')

//GET all pets
exports.get_pets = async(req,res,next)=>{

    //FILTERING 
    //Array with keywords NOT to be used in the filter query
    const nonFilters = ['page','sort','limit','fields'];
    //Make a copy of the request query
    let newFilters = {...req.query};
    console.log(req.query)
    //Remove all the keywords NOT to be used in the filter query, inside the req.query copy
    nonFilters.forEach(el=>{
        if(req.query.hasOwnProperty(el))
        {
           delete newFilters[el]
        }
    })

    //If there's relational operators in the request query
    let queryString = JSON.stringify(newFilters)
    //Replace the operators with mongodb operators
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchedString) => `$${matchedString}`)
    console.log(queryString)
    //Get the completed query 
    let query = petModel.find(JSON.parse(queryString))

    //SORTING
    if(req.query.sort)
    {
        //With multiple sorts
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy) 
    }
    //Default sorting by latest
    else
    {
        query = query.sort('-createdAt')
    }

    //Get all pets in the db based on filtering,sorting or no filters,sorts
    let pets = await query.populate('breeder_name')

    
    if(pets.length == 0)
    {
        res.status(400).json({
            status:'Fail',
            message:'Could not find any pets'
        })
    }
    else
    {
        res.status(200).json({
            status:'Success',
            pets
        })
    }
}
//GET pet based on id
exports.get_pet = async(req,res,next)=>{
    //Get the pet id from url params
    const pet = await petModel.findOne({_id:req.params.petId}).populate('breeder_name')

    //If there's no pet to be found
    if(pet===null)
    {
        res.status(400).json({
            status:'Fail',
            message:'Pet can not be found'
        })
    }
    else
    {
        res.status(200).json({
            status:'Success',
            pet
        })
    }
}
//POST (create) pet
exports.create_pet = async(req,res,next)=>{
    const pet = await petModel.create({
        pet_name:req.body.pet_name,
        type:req.body.type,
        price:req.body.price,
        breed:req.body.breed,
        age:req.body.age,
        color:req.body.color,
        height:req.body.height,
        weight:req.body.weight,
        hereditery_sicknesses:req.body.hereditery_sicknesses,
        image:req.body.image,
        description:req.body.description,
        breeder_name:req.body.breeder_name
    })
    res.status(201).json({
        status:'Pet created',
        pet  
    })
}
//PATCH pet
exports.update_pet = async(req,res,next)=>{
     //Get the user by req.user
     const user = await User.findById(req.user._id)
     //Function to filter fields
     const filteredFields = func.filterFunction(req.body, 'pet_name','type','price','breed','age','color','height','weight','hereditery_sicknesses','image','description')
 
     //If the request body contains breeder name field
     if(req.body.breeder_name)
     {
         res.status(400).json({
             status:'Fail',
             message:'You can not update breeder here. Please contact our customer services'
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
//DELETE pet
exports.delete_pet = async(req,res,next)=>{
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
       await petModel.findByIdAndDelete(req.params.petId)

       res.status(204).json({
           status:'Success',
           message:'Pet Deleted'
       })
    }
}