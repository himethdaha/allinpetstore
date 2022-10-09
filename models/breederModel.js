const mongoose = require('mongoose');
const validator = require('validator')

const breederSchema = new mongoose.Schema({
    breeder_name:{type:String,trim:true,required:[true,'Breeder Name is required']},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    address:{type:String,trim:true,required:[true,'Address is required']},
    state:{type:String,enum:['AB','BC','MB','NB','NL','NT','NS','NU','ON','PE','QC','SK','YT'],trim:true,required:[true,'State is required']},
    postal_code:{type:String,minLength:[6,'Postal code is 6 characters'],maxLength:[6,'Postal code is 6 characters'],trim:true,required:[true,'Enter the postal code'],
    validate: {
        validator:function(val)
        {
        return validator.isAlpha(val,{ignore:' '})
        },
        message:`Postal Code can't contain spaces`
    }
    }
})

module.exports = mongoose.model('Breeder',breederSchema);