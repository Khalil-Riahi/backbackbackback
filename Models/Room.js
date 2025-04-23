const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    numRoom: {
        type: Number,
        required: [true , 'A table must have number'],
        unique: [true , 'duplicated numTables']

    },
    roomName:{
        type:String,
    },
    
    QrCode: {
        type: String,
        required: [true , 'the table must have the QrCode']
    }
    ,
    status:{
        type: String,
    },
    capacity:{
        type:Number,
    },
    description:{
        type:[String],
    }

})

const Room = mongoose.model('Room' ,roomSchema )

module.exports = Room