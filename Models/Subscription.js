const mongoose=require('mongoose')

const subscriptionSchema=mongoose.Schema({
    subscriptionType:{
        type:String,
        // enum:['weekly','monthly','yearly'],
        required:true
        
    },
    price:{
        type:Number,
        required:true

    },

    table_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table', 
    },
    // description:{
    //     type:[String],
    //     required:true
    // },
    // roomType:{
    //     type: String,
    //     required: [true , 'it must have roomType']
    // },
})
   const User = mongoose.model('Subscription', subscriptionSchema);
    module.exports = User;