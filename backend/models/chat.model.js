const mongoose = require("mongoose");
//const validator = require("node-mongoose-validator")
const Schema = mongoose.Schema;

const PrivateChatSchema = new Schema({
    user: [{ type: Schema.Types.ObjectId, ref: "User"}],
    chatHistory:[{speaker:{ type: Schema.Types.ObjectId, ref: "User"},username:String,userId:Number,text:String,time:Date}],
}, {
    timestamps: true,
});

const PrivateChat = mongoose.model("PrivateChat",PrivateChatSchema);

const GroupChatSchema = new Schema({
    host: { type: Schema.Types.ObjectId, ref: "User",required: true},
    member: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    room: { type: String, unique: true, required: true },
    chatHistory:[{speaker:{ type: Schema.Types.ObjectId, ref: "User"},username:String,userId:Number,text:String,time:Date}],
}, {
    timestamps: true,
});

const GroupChat = mongoose.model("GroupChat",GroupChatSchema);

exports.PrivateChat = PrivateChat;
exports.GroupChat = GroupChat;