let mongoose = require('mongoose');
let uniqueVal = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//Importación necesarias
let {
    personal_id_type_enum,
    gender_enum
} = require('./enums/enums');

let CustomerSchema = new Schema({
    personal_id_type: {
        type: String,
        required: [true, 'Campo personal_id_type es obligatorio'],
        enum: personal_id_type_enum
    },
    personal_id: {
        unique: true,
        type: Number,
        required: [true, 'Campo personal_id es obligatorio']
    },
    first_name: {
        type: String,
        required: [true, 'Campo first_name es obligatorio']
    },
    last_name: {
        type: String,
        required: [true, 'Campo last_name es obligatorio']
    },
    gender: {
        type: String,
        required: [true, 'Campo gender es obligatorio'],
        enum: gender_enum
    },
    birth_date: {
        type: Date,
        required: [true, 'Campo birth_date es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'Campo email es obligatorio']
    },
    phone_number: {
        type: Number,
        unique: true,
        required: [true, 'Campo phone_number es obligatorio'],
        min: [900000000, 'Campo phone_number debe tener una longitud de 9'],
        max: [999999999, 'Campo phone_number debe tener una longitud de 9'],
        required: [true, 'Campo phone_number es obligatorio']
    }

})


CustomerSchema.plugin(uniqueVal, {
    message: 'El {PATH} debe ser único'
});

CustomerSchema.methods.toJSON = function() {
    let Aux = this;
    let AuxObjeto = Aux.toObject();
    delete AuxObjeto.password;

    return AuxObjeto;
}

module.exports = mongoose.model('Customer', CustomerSchema);