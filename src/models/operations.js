let mongoose = require('mongoose');
let uniqueVal = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//Importación necesarias
let {
    currency_enum
} = require('./enums/enums');

//Importación necesarias
let currency_data = require('./enums/currency').currency;

let OperationSchema = new Schema({
    charge_account: {
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

OperationSchema.methods.toShowAccountFormat = function (accountId) {
    let Aux = this;
    let operacion = Aux.toObject();

    if (operacion.charge_account == accountId) {
        operacion.amount *= -1;
        operacion["currency_short_format"] = currency_data[operacion.moneda_origen].short;
        operacion["amount_format"] = `-${currency_data[operacion.moneda_origen].short} ${operacion.amount}`
    }
    if (operacion.destination_account == accountId) {
        operacion.amount *= operacion.rate_exchange;
        operacion["currency_short_format"] = currency_data[operacion.moneda_origen].short;
        operacion["amount_format"] = `+${currency_data[operacion.moneda_destino].short} ${operacion.amount}`
    }

    delete operacion.charge_account;
    delete operacion.destination_account;
    delete operacion.rate_exchange;
    delete operacion.__v;
    delete operacion.moneda_origen;
    delete operacion.moneda_destino;

    return operacion;
}

module.exports = mongoose.model('Operation', OperationSchema);