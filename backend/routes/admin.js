/*

1. del specific user 
2. del specific post 
3. del specific comment 

*/

const router = require('express').Router();
let User = require("../models/user.model");
let {PrivateChat,GroupChat} = require("../models/chat.model")
let getUserObjectId = require("../common");
let {Post,Comment} = require("../models/post.model");

/*
1. login
2. forgotPw
3. resetPw
4. Logout 
*/

//view all private chat
router.get("/admin/private/viewAllChat", (req, res) => {
    PrivateChat.find()
    .populate({path:"user",select:["username","userId"]})
    .exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json(results)
        }
    })
})

//view all group chat
router.get("/admin/group/viewAllChat", (req, res) => {
    GroupChat.find()
    .populate({path:"host",select:["username","userId"]})
    .exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            console.log(results)
            return res.status(200).json(results)
        }
    })
})

//delete user
router.post("/admin/delete/user",async(req,res)=>{
    let userObjectId = await getUserObjectId(req.body.userId)
    User.deleteOne({_id:userObjectId},function(err){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json({msg:"deleted!"})
        }
    })
})

//delete post
router.post("/admin/delete/post",async(req,res)=>{
    Post.findOneAndDelete({_id:req.body.postObjectId}).exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            //console.log(results.comment)
            Comment.deleteMany({_id:{$in: results.comment}}).exec(function(err){
                if(err){
                    console.log(err)
                    return res.status(400).json({msg:"sth goes wrong"})
                }else{
                    //console.log("deleted")
                    return res.status(200).json({msg:"Post and " + results.comment.length + " comment are deleted"})
                }
            })
        }
    })
})

//delete comment
router.post("/admin/delete/comment",async(req,res)=>{
    Comment.findOneAndDelete({_id:req.body.commentObjectId}).exec(function(err){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"sth goes wrong"})
        }else{
            return res.status(200).json({msg:"comment deleted"})
        }
    })
})

module.exports = router;