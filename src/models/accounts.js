let mongoose = require('mongoose');
let uniqueVal = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//Importación necesarias
let {
    currency_enum
} = require('./enums/enums');

let currencyData = require('./enums/currency').currency;

let AccountsSchema = new Schema({
    account_number: {
        type: String,
        required: [true, 'Campo account_number es obligatorio'],
        unique: true
    },
    currency: {
        type: String,
        required: [true, 'Campo currency es obligatorio'],
        enum: currency_enum
    },
    open_date: {
        type: Date,
        required: [true, 'Campo open_date es obligatorio']
    },
    balance: {
        type: Number,
        required: [true, 'Campo balance es obligatorio']
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})


AccountsSchema.methods.sinIds = function () {
    let Aux = this;
    let cuenta = Aux.toObject();

    delete cuenta.customer._id;

    return cuenta;
}

AccountsSchema.methods.toFormat = function () {
    let Aux = this;
    let cuenta = Aux.toObject();

    let currency_short = currencyData[cuenta.currency].short;
    let account_number = cuenta["account_number"];
    cuenta["currency_short_format"] = currency_short;
    cuenta["balance_format"] = `${currency_short} ${cuenta["balance"]}`;
    cuenta["cci_format"] = `${account_number.substring(1, 4)}-${account_number.substring(5,8)}-00${account_number.substring(8)}-15`;
    cuenta["account_number_format"] = `${account_number.substring(0, 4)}-${account_number.substring(4,8)}-${account_number.substring(8)}`;
    cuenta["account_type"] = `CUENTA AHORRO`;

    return cuenta;
}


AccountsSchema.plugin(uniqueVal, {
    message: 'El {PATH} debe ser único'
});

module.exports = mongoose.model('Accounts', AccountsSchema);