const mongoose = require('mongoose')

const TablePaiementSchema = mongoose.Schema({
    
    check_in: {
        type: String,
        required: [true , 'enter start date']
    },
    check_out: {
        type: String,
        required: [true , 'enter end date']
    },
    date:{
        type:Date,
        required:[true,'enter date']

    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true , 'a user id is missed for reservation']
    },
    numTable: {
        type: Number,
        ref: 'Table',
        required: [true, 'a table id is missed for reservation']
      },
    price:{
        type:Number,
        required:[true,'price is missed']

    },
    paymentMethod:{
        type:String,
    }

})


const TablePaiement = mongoose.model('TablePaiement' , TablePaiementSchema)

module.exports = TablePaiement