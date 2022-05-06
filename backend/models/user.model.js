/*
This file holds the database models for user
*/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    userId:{type: Number, required: true, unique: true,default:1},
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    email:{type: String, required: true, trim: true},
    photo:{type:Buffer, contentType: String},
    description:{type: String, required:true, default:"Welcome to my page"},
    isVerified:{type: Boolean, default: false},
    gpInvitation:[{room:{ type: Schema.Types.ObjectId, ref: "GroupChat"},time:Date}],
    frdInvitation:[{inviter:{ type: Schema.Types.ObjectId, ref: "User"},time:Date}],
    friend:[{ type: Schema.Types.ObjectId, ref: "User"}]
}, {
    timestamps: true,
});

const User = mongoose.model('User',userSchema);
module.exports = User;