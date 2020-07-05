let mongoose = require('mongoose');
let uniqueVal = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//Importación necesarias
let { 
    currency_enum
} = require('./enums/enums');

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
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})


AccountsSchema.methods.sinIds = function() {
    let Aux = this;
    let cuenta = Aux.toObject();

    delete cuenta.customer._id;

    return cuenta;
}

AccountsSchema.plugin(uniqueVal, {
    message: 'El {PATH} debe ser único'
});

module.exports = mongoose.model('Accounts', AccountsSchema);