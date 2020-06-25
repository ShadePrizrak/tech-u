const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    personal_id_type:{
        type: String
    },
    personal_id:{
        type: String
    },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    }

})