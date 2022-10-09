const mongoose = require('mongoose');
const validator = require('validator')

const petSchema = new mongoose.Schema({
    pet_name:{type:String,trim:true,required:[true,`Pet name is required`]},
    type:{type:String,trim:true,required:[true,`Enter what type of animal your pet is`]},
    price:{type:Number,trim:true,required:[true,`Enter pet's price`], get:(val)=>{(val/100).toFixed(2)}, set:(val)=>{val*100}},
    breed:{type:String,trim:true,required:[true,`Enter pet's breed`]},
    age:{type:String,trim:true,required:[true,`Enter pet's age`]},
    color:{type:String,trim:true,required:[true,`Enter pet's color`]},
    height_length:{type:Number,trim:true,required:[true,`Pet's height is required`]},
    weight:{type:Number,trim:true,required:[true,`Pet's weight is required`]},
    hereditery_sicknesses:{type:[String],required:[true,'Any or all of the breeds genetic sicknesses must be stated']},
    image:{type:String,required:['true','An image of the pet is required']},
    description:{type:String,minLength:[20,'Need a description of at least 20 characters'],maxLength:[200,`Description can't exceed 200 characters`], trim:true,required:true},
    breeder_name:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},
{
    toJSON:{getters:true}
})

module.exports = mongoose.model('Pet',petSchema);