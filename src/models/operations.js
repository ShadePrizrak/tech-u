let mongoose = require('mongoose');
let uniqueVal = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//Importación necesarias
let {
    currency_enum
} = require('./enums/enums');

let OperationSchema = new Schema({
    charge_account:{
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: [true, 'Campo charge_account es obligatorio']
    },
    destination_account: {
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: [true, 'Campo destination_account es obligatorio']
    },
    amount: {
        type: Number,
        required: [true, 'Campo amount es obligatorio']
    },
    date: {
        type: Date,
        required: [true, 'Campo date es obligatorio'],
        default: new Date()
    },
    concept: {
        type: String,
        required: false
    },
    rate_exchange: {
        type: Number,
        required: [true, 'Campo rate_exchange es obligatorio']
    },
    itf: {
        type: Number,
        required: [true, 'Campo itf es obligatorio']
    },
    moneda_origen: {
        type: String,
        required: [true, 'Campo moneda_origen es obligatorio'],
        enum: currency_enum
    },
    moneda_destino: {
        type: String,
        required: [true, 'Campo moneda_destino es obligatorio'],
        enum: currency_enum
    }
})

module.exports = mongoose.model('Operation', OperationSchema);