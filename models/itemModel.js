const mongoose = require('mongoose');
const validator = require('validator')
const slugify = require('slugify')

const itemSchema = new mongoose.Schema({
    item_name:{type:String,trim:true,maxLength:[20,'Maximum characters is 20'],required:[true,'Item name is required']},
    store_name:{type:mongoose.Schema.Types.ObjectId,ref:'Store'},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    description:{type:String,trim:true,maxLength:[150,'Only 150 characters allowed'],required:[true,'Description is required']},
    price:{type:Number,trim:true,required:[true,'Price is required'], get: (val)=>{(val/100).toFixed(2)}, set: (val)=>{val*100}},
    quantity:{type:Number,trim:true,required:[true,'Quantity is required']},
    category:{type:[String],required:[true,'Specify a category for your item'],enum:['Pet-food','Toys','Pet-beds','kennels','Food-bowls']},
    createdAt:{type:Date,default:Date.now(),immuatable:true,select:false},
    noOfRatings:{type:Number,default:0},
    avgRatings:{type:Number,min:[1,`Rating must be above 1.0`], max:[5,`Rating must be below 5`]},
    slug:{type:String}
},
{
    toJSON:{getters:true, virtuals:true},
    toObject:{virtuals:true},
    id:false
    
})

//Virtuals
itemSchema.virtual('Review',{
    path:'Review',
    foreignField:'item',
    localField:'_id'
})

//DOC Middleware
itemSchema.pre(/^find/,function(next)
{
    this.populate({path:'store_name',select:'store_name noOfRatings Rating'})
    next()
})

itemSchema.pre('save', function(next)
{
    if(this.isModified('createdAt'))
    {
        return next(new Error(`You can not change the createdAt field`))
    }
    next()
})

itemSchema.pre('save', function(next){
    this.slug = slugify(this.item_name, {
        lower:true
    })

    next()
})


module.exports = mongoose.model('Item',itemSchema);