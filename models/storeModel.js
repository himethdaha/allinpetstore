const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify')

const storeSchema = new mongoose.Schema({
    store_name:{type:String,trim:true,unique:true,required:[true,'Store name is required']},
    description:{type:String,maxLength:[200,`Maximum characters is 200`]},
    owner:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    address:{type:String,trim:true,required:[true,'Address is required']},
    state:{type:String,enum:['AB','BC','MB','NB','NL','NT','NS','NU','ON','PE','QC','SK','YT'],trim:true,required:[true,'State is required']},
    postal_code:{type:String,minLength:[6,'Postal code is 6 characters'],maxLength:[6,'Postal code is 6 characters'],trim:true,required:[true,'Postal code is required']},
    createdAt:{type:Date,default:Date.now(),immuatable:true,select:false},
    noOfRatings:{type:Number,default:0},
    avgRatings:{type:Number,min:[1,`Rating must be above 1.0`], max:[5,`Rating must be below 5`]},
    slug:{type:String},
    storeLocation:{type:{type:String,default:'Point',enum:['Point']},coordinates:[Number]}   
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    id:false
})

//Geo index
storeSchema.index({storeLocation:'2dsphere'})
//Virtuals
storeSchema.virtual('review',{
    path:'Review',
    foreignField:'store',
    localField:'_id'
})
//DOC Middleware
storeSchema.pre(/^find/,function(next)
{
    this.populate({path:'owner',select:'first_name last_name profile_photo'})
    next()
})

storeSchema.pre('save', function(next)
{
    if(this.isModified('createdAt'))
    {
        return next(new Error(`You can not change the createdAt field`))
    }
    next()
})

storeSchema.pre('save',function(next){
    this.slug = slugify(this.store_name, {
        lower:true
    })
    next()
})
module.exports = mongoose.model('Store',storeSchema);