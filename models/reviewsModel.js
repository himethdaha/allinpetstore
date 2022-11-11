const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title:{type:String,trim:true,required:[true,'Review must have a title'],maxLength:[20,'Title can not exceed 20 characters']},
    description:{type:String,trim:true,required:[true,'Review must have a description'],maxLength:[150,'Title can not exceed 150 characters']},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:[true,'Review must have a user']},
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

//DOC Middleware
//To populate all find queries with referenced docs
reviewSchema.pre(/^find/,function(next){
    this.populate({path:'user',select:'first_name last_name'})
    next()
})

module.exports =  mongoose.model('Review',reviewSchema)