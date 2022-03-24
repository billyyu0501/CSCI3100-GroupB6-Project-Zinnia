const mongoose = require("mongoose");
//const validator = require("node-mongoose-validator")
const Schema = mongoose.Schema;

const PrivateChatSchema = new Schema({
    user: [{ type: Schema.Types.ObjectId, ref: "User"}],
    chatHistory:[{speaker:{ type: Schema.Types.ObjectId, ref: "User"},text:String,time:Date}],
}, {
    timestamps: true,
});

const PrivateChat = mongoose.model("PrivateChat",PrivateChatSchema);

const GroupChatSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    user: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    host: { type: Schema.Types.ObjectId, ref: "User",required: true},
    room: { type: String, unique: true, required: true },
    chatHistory:[{speaker:String,text:String,time:Date}],
}, {
    timestamps: true,
});

const GroupChat = mongoose.model("GroupChat",GroupChatSchema);

exports.PrivateChat = PrivateChat;
exports.GroupChat = GroupChat;


