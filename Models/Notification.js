const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({

    title:{
        type: String,
    },
    content: {
        type: String,
        required: [true , 'The Notification must have content']
    },
    sentDate: {
        type: Date,
        default: new Date(),
        required: [true , 'The Notification must sent date']
    },
    sentTime: {
        // default: 
        type: String,
        default: () => {
            const now = new Date()
            return now.toTimeString().slice(0,5)
        },

        required: [true , 'The Notification must sent time']


    },
    points: {
        type: Number
    },
    status: {
        type: String,
        required: [true , 'the notification must have a status'],
        default: 'not-treated'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true , 'The Notification must have user id']
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true , 'The Notification must have sender id']
    }
})

const Notification = mongoose.model('Notification' , notificationSchema)

module.exports = Notification