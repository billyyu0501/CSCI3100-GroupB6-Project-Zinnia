const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{type: Number, required: true, unique: true,default:1},
    username:{type: String, required: true, unique: true, minlength:4, maxlength:20},
    password:{type: String, required: true, minlength:5, maxlength:20},
    email:{type: String, trim: true},
    photo:{type:Buffer, contentType: String},
    description:{type: String, required:true, default:"Welcome to my page"},
    isAdmin:{type: Boolean, required: true, default:false}
}, {
    timestamps: true,
});

const User = mongoose.model('User',userSchema);
module.exports = User;