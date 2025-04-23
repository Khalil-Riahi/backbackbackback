const mongoose = require('mongoose')

const userSubscriptionSchema = mongoose.Schema({
    
    start_date: {
        type: Date,
        required: [true , 'enter start date']
    },
    end_date: {
        type: Date,
        required: [true , 'enter end date']
    },
    status: { 
        type: String,
        enum: ["active", "unavailable"], 
        default: "active" },

    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true , 'a user id is missed for reservation']
    },
    id_subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: [true , 'a user id is missed for subscription']
    },
   
})


const userSubscriptionModel = mongoose.model('UserSubscription' , userSubscriptionSchema)

module.exports = userSubscriptionModel