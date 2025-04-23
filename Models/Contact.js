const mongoose = require('mongoose')
const validator = require('validator');
const ContactSchema = mongoose.Schema({
    email: {
       type: String,
       required: [true, 'Please provide your email'],
       lowercase: true,
       validate: [validator.isEmail, 'Please provide a valid email'],
     },
    name:{
        type:String,
        required:[true,'the name required'],

    },
    
    Message: {
        type: String,
        required: [true , 'Message required']
    }
    ,
    Sujet:{
        type: String,
        required: [true , 'sujet required']
    },
    phoneNumber:{
        type:Number,
        required:[true,'phone number is required ']
    }

})

const Contact = mongoose.model('Contact' , ContactSchema)

module.exports = Contact