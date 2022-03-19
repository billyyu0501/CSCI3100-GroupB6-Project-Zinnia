const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let User = require("../models/user.model")

const CommentSchema = new Schema({
    commenter:{type:Schema.Types.ObjectId, ref:"User"},
    comments: {type:String, required:true},
    like:{type:Number,default:0}
},{
    timestamps:true,
})
const Comment = mongoose.model("Comment",CommentSchema);



const PostSchema = new Schema({
    title:{type: String, required: true},
    writer:{type:Schema.Types.ObjectId,ref:"User",required:true},
    content:{type:String,required:true},
    comment:[{type:Schema.Types.ObjectId,ref:"Comment"}],
    like:{type:Number,default:0}
}, {
    timestamps: true,
});

const Post = mongoose.model('Post',PostSchema);

exports.Post = Post;
exports.Comment = Comment;