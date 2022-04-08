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
const { findOneAndUpdate } = require('../models/user.model');

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

//delete privateChat
router.post("/admin/delete/privateChat",async(req,res)=>{
    PrivateChat.findOneAndDelete({_id:req.body.chatObjectId}).exec(function(err){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"sth goes wrong"})
        }else{
            return res.status(200).json({msg:"chat deleted"})
        }
    })
})

//delete groupChat
router.post("/admin/delete/groupChat",async(req,res)=>{
    GroupChat.findOneAndDelete({_id:req.body.roomObjectId}).exec(function(err){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"sth goes wrong"})
        }else{
            return res.status(200).json({msg:"group deleted"})
        }
    })
})

router.post("/admin/:userId/profile", (req, res) => {
    if (req.body.changeUsername == "" && req.body.changeDescription == ""){
        return res.status(400).send({msg: "Please fill in the blanks if you want to update your profile."})
    }

    if (req.body.changeUsername != ""){
        User.findOne({ username: req.body.changeUsername }, (err, user) => {
            if (user){
                return res.status(401).send({msg: "Username existed. Please choose another username."})
            }  
        })
        User.findOne({ userId: req.params.userId, }, (err, user) => {
            if(!user){
                return res.status(401).send({msg: "We cannot find this user to update."})
            }
            else {
                user.username = req.body.changeUsername
                user.save(() => {
                    if (err){
                        return res.status(500).send({msg: err.message});
                    }
                    else{
                        return res.status(201).send({msg: "Profile has been update"});
    
                    }
                })
            }
        })
    }
    if (req.body.changeDescription != ""){
        User.findOne({ userId: req.params.userId, }, (err, user) => {
            if(!user){
                return res.status(401).send({msg: "We cannot find this user to update."})
            }
            else{
                user.description = req.body.changeDescription
                user.save(() => {
                    if (err){
                        return res.status(500).send({msg: err.message});
                    }
                    else{
                        return res.status(200).send({msg: "Profile has been update"});

                    }
                })
            }

        })
    }
})
module.exports = router;