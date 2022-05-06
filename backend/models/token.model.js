/*
This file holds the database models for token, which is for email verification of registeration
*/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 600000 } }
    
});

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;