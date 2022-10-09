const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    first_name:{type:String,minLength:[1,'Minimum characters required is 1'],maxLength:[10,'Maximum characters is 10'],trim:true,required:[true,'Enter your first name'],
    validate:{
        validator: function(val)
        {
            return validator.isAlpha(val,['en-US'], {ignore:' '})
        },
        message: 'First name can only contain letters'
    }},
    last_name:{type:String,minLength:[1,'Minimum characters required is 1'],maxLength:[15,'Maximum characters is 15'],trim:true,required:[true,'Enter your last name'],
    validate:{
        validator: function(val)
        {
            return validator.isAlpha(val,['en-US'],{ignore:' '})
        },
        message: 'Last name can only contain letters'
    }
    },
    email:{type:String,trim:true,unique:true,lowercase:true,required:[true, 'Email is required'],
    validate:{
        validator: function(val){
            return validator.isEmail(val)
        },
        message: 'Enter a valid email address'
    }},
    password:{type:String,minLength:[8,'Minimum length is 8 characters'],required:[true,'Password is required'],
    validate:{
        validator:function(val)
        {
            return validator.isStrongPassword(val)
        },
        message: 'Password must contain at least one number, symbol and a capital letter'
    }},
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
    },
    role:{type:String,enum:['user','owner','breeder'],required:[true,'role is required']},


})
module.exports = mongoose.model('User',userSchema);