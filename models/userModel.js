const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    first_name:{type:String,minLength:[1,'Minimum characters required is 1'],maxLength:[15,'Maximum characters is 10'],trim:true,required:[true,'Enter your first name'],
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
    password:{type:String,minLength:[8,'Minimum length is 8 characters'],select:false,required:[true,'Password is required'],
    validate:{
        validator:function(val)
        {
            return validator.isStrongPassword(val)
        },
        message: 'Password must contain at least one number, symbol and a capital letter'
    }},
    passwordConfirm:{type:String,minLength:[8,'Minimum length is 8 characters'],required:[true,'Password Confirmation is required'],
    validate: {
        validator: function(val)
        {
            return this.password === val
        },
        message:'Password does not match'
    }
    },
    address:{type:String,trim:true,required:[true,'Address is required']},
    state:{type:String,enum:['AB','BC','MB','NB','NL','NT','NS','NU','ON','PE','QC','SK','YT'],trim:true,required:[true,'State is required']},
    postal_code:{type:String,minLength:[6,'Postal code is 6 characters'],maxLength:[6,'Postal code is 6 characters with no special characters'],trim:true,required:[true,'Enter the postal code']},
    role:{type:String,enum:['user','owner','breeder'],required:[true,'role is required'],default:'user'},
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date,
    passwordChangeTime:Date,
    createdAt:{type:Date,default:Date.now(),immuatable:true,select:false}   


})

//DOC Middleware
//To hash user passwords
userSchema.pre('save',async function(next){
    let user = this
    //If password wasn't modified don't run 
    if(!user.isModified('password')) return next()

    user.password = await bcrypt.hash(user.password,10)
    user.passwordConfirm = undefined
    user.passwordChangeTime = Date.now()
    next()
})



//Instance method
//To create user password reset token
userSchema.methods.passwordResetToken = function()
{
    //Create token to be sent to the user
    const resetToken = crypto.randomBytes(32).toString('hex')
    //Encrypt the token
    const cryptedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordToken = cryptedResetToken
    console.log(this.resetPasswordToken,resetToken)
    //Expire reset token in 10 mins
    this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000
    //Return the uncrypted token to be used by the user
    console.log(`Reset token in model: ${resetToken}`)
    return resetToken
}

module.exports = mongoose.model('User',userSchema);
