const express = require('express')
const petModel = require('../models/petModel')

//GET all pets
exports.get_pet = async(req,res,next)=>{
    //Get all pets in the db
    const pets = await petModel.find().populate('breeder_name')

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
        height:req.body.height_length,
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

}
//DELETE pet
exports.delete_pet = async(req,res,next)=>{

}