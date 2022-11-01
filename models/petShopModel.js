const mongoose = require('mongoose');
const validator = require('validator');


const petShopSchema = new mongoose.Schema({
    petShop_name:{type:String,trim:true,unique:true,required:[true,'Pet shop name is required']},
    description:{type:String,maxLength:[200,`Maximum characters is 200`]},
    owner:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    address:{type:String,trim:true,required:[true,'Address is required']},
    state:{type:String,enum:['AB','BC','MB','NB','NL','NT','NS','NU','ON','PE','QC','SK','YT'],trim:true,required:[true,'State is required']},
    postal_code:{type:String,minLength:[6,'Postal code is 6 characters'],maxLength:[6,'Postal code is 6 characters'],trim:true,required:[true,'Postal code is required']},
    createdAt:{type:Date,default:Date.now(),immuatable:true,select:false},
    noOfRatings:{type:Number,default:0},
    Rating:{type:Number,min:[1,`Rating must be above 1.0`], max:[5,`Rating must be below 5`],set:val=> Math.round(val*10)/10}   
})

petShopSchema.pre('save', function(next)
{
    if(this.isModified('createdAt'))
    {
        return next(new Error(`You can not change the createdAt field`))
    }
    next()
})

module.exports = mongoose.model('PetShop',petShopSchema);