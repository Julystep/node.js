const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/itcast', {useNewUrlParser: true});

const Schema  = mongoose.Schema;

const studentSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    gender: {
        type : String,
        enum : [0, 1],
        required : true
    },
    age :{
        type : Number,
        required : true
    },
    hobbies: {
        type : String,
        required : false
    },
})

module.exports = mongoose.model('Student', studentSchema);
