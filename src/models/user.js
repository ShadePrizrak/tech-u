const mongoose = require('mongoose');
let uniqueVal = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    password:{
        type: String,
        required: [true, 'Campo personal_id_type es obligatorio'],
        unique: true
    },
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'Campo Customer es obligatorio'],
        unique: true
    }

})

userSchema.plugin(uniqueVal, {
    message: 'El {PATH} debe ser único'
});

userSchema.methods.toJSON = function() {
    let Aux = this;
    let AuxObjeto = Aux.toObject();
    delete AuxObjeto.password;

    return AuxObjeto;
}

module.exports = mongoose.model('User', userSchema);