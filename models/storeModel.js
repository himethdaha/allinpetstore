const mongoose = require('mongoose');
const validator = require('validator');


const storeSchema = new mongoose.Schema({
    store_name:{type:String,trim:true,unique:true,required:[true,'Store name is required']},
    description:{type:String,maxLength:[200,`Maximum characters is 200`]},
    owner:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    address:{type:String,trim:true,required:[true,'Address is required']},
    state:{type:String,enum:['AB','BC','MB','NB','NL','NT','NS','NU','ON','PE','QC','SK','YT'],trim:true,required:[true,'State is required']},
    postal_code:{type:String,minLength:[6,'Postal code is 6 characters'],maxLength:[6,'Postal code is 6 characters'],trim:true,required:[true,'Postal code is required']},
    createdAt:{type:Date,default:Date.now(),immuatable:true,select:false},
    noOfRatings:{type:Number,default:0},
    avgRatings:{type:Number,min:[1,`Rating must be above 1.0`], max:[5,`Rating must be below 5`]}   
})

storeSchema.pre('save', function(next)
{
    if(this.isModified('createdAt'))
    {
        return next(new Error(`You can not change the createdAt field`))
    }
    next()
})

module.exports = mongoose.model('Store',storeSchema);