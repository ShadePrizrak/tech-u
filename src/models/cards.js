let mongoose = require('mongoose');
let uniqueVal = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//Importación necesarias
let { 
    card_type_enum
} = require('./enums/enums');

let AccountsSchema = new Schema({
    card_number: {
        type: String,
        required: [true, 'Campo card_number es obligatorio'],
        unique: true
    },
    card_type: {
        type: String,
        required: [true, 'Campo card_type es obligatorio'],
        enum: card_type_enum
    },
    expiration_date: {
        type: String,
        required: [true, 'Campo expiration_date es obligatorio']
    },
    ccv: {
        type: String,
        required: [true, 'Campo ccv es obligatorio']
    },
    pin:{
        type: String,
        required: [true, 'Campo pin es obligatorio']
    },
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})


AccountsSchema.plugin(uniqueVal, {
    message: 'El {PATH} debe ser único'
});

module.exports = mongoose.model('Cards', AccountsSchema);