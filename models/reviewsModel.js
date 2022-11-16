const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title:{type:String,trim:true,required:[true,'Review must have a title'],maxLength:[30,'Title can not exceed 30 characters']},
    description:{type:String,trim:true,required:[true,'Review must have a description'],maxLength:[150,'Title can not exceed 150 characters']},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    petShop:{type:mongoose.Schema.Types.ObjectId, ref:'PetShop'},
    store:{type:mongoose.Schema.Types.ObjectId, ref:'Store'},
    item:{type:mongoose.Schema.Types.ObjectId, ref:'Item'},
    createdAt:{type:Date,default:Date.now(),immuatable:true,select:false}
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    id:false
})

//Creating compound indexes to prevent duplicate reviews
reviewSchema.index({petShop:1,store:1,item:1,user:1},{unique:true})
//DOC Middleware
//To populate all find queries with referenced docs
reviewSchema.pre(/^find/,function(next){
    this.populate({path:'user',select:'first_name last_name'})
    next()
})

module.exports =  mongoose.model('Review',reviewSchema)