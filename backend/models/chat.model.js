const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PrivateChatSchema = new Schema({
    user1: { type: Schema.Types.ObjectId, ref: "User", require: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", require: true },
    chatHistory:[{speaker:String,text:String}],
}, {
    timestamps: true,
});

const PrivateChat = mongoose.model("PrivateChat",CommentSchema);

const GroupChatSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    user: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    host: { type: Schema.Types.ObjectId, ref: "User",required: true},
    room: { type: String, unique: true, required: true },
    chatHistory:[{speaker:String,text:String}],
}, {
    timestamps: true,
});

const GroupChat = mongoose.model("PrivateChat",CommentSchema);

exports.PrivateChat = PrivateChat;
exports.GroupChat = GroupChat;


