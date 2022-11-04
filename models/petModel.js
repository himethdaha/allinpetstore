const mongoose = require('mongoose');
const validator = require('validator');
const petShopModel = require('./petShopModel');

const petSchema = new mongoose.Schema({
    pet_name:{type:String,trim:true,required:[true,`Pet name is required`]},
    type:{type:String,trim:true,enum:['canine','feline','aquatic','aerial'],required:[true,`Enter what type of animal your pet is`]},
    price:{type:Number,trim:true,required:[true,`Enter pet's price`], get:getPrice, set:setPrice},
    breed:{type:String,trim:true,required:[true,`Enter pet's breed`]},
    age:{type:String,trim:true,required:[true,`Enter pet's age`]},
    color:{type:String,trim:true,required:[true,`Enter pet's color`]},
    height:{type:Number,trim:true,required:[true,`Pet's height is required`]},
    weight:{type:Number,trim:true,required:[true,`Pet's weight is required`]},
    hereditery_sicknesses:{type:[String],required:[true,'Any or all of the breeds genetic sicknesses must be stated']},
    image:{type:String},
    description:{type:String,minLength:[20,'Need a description of at least 20 characters'],maxLength:[200,`Description can't exceed 200 characters`], trim:true,required:true},
    petShop_name:{type:mongoose.Schema.Types.ObjectId,ref:'PetShop'},
    createdAt:{type:Date,default:Date.now(),immuatable:true,select:false},
    slug:{type:String}
},
{
    toJSON:{getters:true}
})

function getPrice(num)
{
    return (num/100).toFixed(2)
}

function setPrice(num)
{
    return num*100
}

//DOC Middleware
petSchema.pre('save',function(next){
    this.slug = slugify(this.item_name, {
        lower:true
    })

    next()
})
module.exports = mongoose.model('Pet',petSchema);