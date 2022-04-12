const router = require('express').Router();
let User = require("../models/user.model");
let {PrivateChat,GroupChat} = require("../models/chat.model")
let getUserObjectId = require("../common").getUserObjectId;
let {Post,Comment} = require("../models/post.model");
const { findOneAndUpdate } = require('../models/user.model');
let bcrypt = require("bcryptjs")
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
            //console.log(results)
            return res.status(200).json(results)
        }
    })
})

//delete user and all of his post + comment + private chat + frd + quit all group chat and delete his conversation in the group
router.post("/admin/delete/user",async(req,res)=>{
    console.log("START DELETE USER")
    let userObjectId = await getUserObjectId(req.body.userId)
    // Delete all comment in all deleted post 
    const posts = await Post.find({writer:userObjectId})
    posts.map(post=>{
        Comment.deleteMany({_id:{$in: post.comment}}).then(function(){
            console.log("Comment in Post deleted")
        }).catch(function(err){
            console.log(err)
            return res.status(400).json({msg:"Fail to delete post comment"})
        })
    })
    //Delete all posts 
    await Post.deleteMany({writer:userObjectId}).then(function(){
        console.log("---Post deleted---")
    }).catch(function(err){
        console.log(err)
        return res.status(400).json({msg:"Fail to delete post"})
    })
    //Delete all Comment
    await Comment.deleteMany({commenter:userObjectId}).then(function(){
        console.log("---Comment deleted---")
    }).catch(function(err){
        console.log(err)
        return res.status(400).json({msg:"Fail to delete Comment"})
    })

    //Clear frd 
    await User.find({friend:userObjectId}).select(["_id","friend"]).then(function(results){
        results.map(user=>{
            user.friend = user.friend.filter(e=>!e.equals(userObjectId))
            User.updateOne({id:user._id},{friend:user.friend}).exec()
        })
        User.updateOne({_id:userObjectId},{friend:[]}).exec()
        console.log("---friend deleted---")
    }).catch(function(err){
        console.log(err)
        return res.status(400).json({msg:"Fail to delete friend"})
    })
    //clear all sent invitation
    await User.find({"frdInvitation.inviter":userObjectId})
    .select(["username"])
    .populate({path:"frdInvitation",select:["username","userId"]})
    .then(function(users){
        console.log(userObjectId)
        users.map(user=>{
            user.frdInvitation = user.frdInvitation.filter(e=>!e.inviter.equals(userObjectId))
            User.findOneAndUpdate({_id:user._id},{frdInvitation:user.frdInvitation}).exec()
        })
        console.log("---frd invitation deleted---")
    }).catch(function(err){
        console.log(err)
        res.status(400).json({msg:"Fail to delete Frd Invitation"})
    })
    //clear all private chat
    await PrivateChat.find({user:userObjectId}).then(function(chats){
        chats.map(chat=>{
            PrivateChat.deleteOne({_id:chat._id}).exec()
        })
        console.log("---Private chat deleted---")
    }).catch(function(err){
        console.log(err)
        return res.status(400).json({msg:"Fail to deletet Private Chat"})
    })

    await GroupChat.find({member:userObjectId})
    .populate({path:"chatHistory"})
    .then(function(chats){
        //for each room, delete the room if deleted user is host, otherwise quit group
        chats.map(chat=>{
            if(!chat.host.equals(userObjectId)){
                chat.member = chat.member.filter(e=>!e.equals(userObjectId))
                GroupChat.updateOne({_id:chat._id},{member:chat.member}).exec()
            }else{
                GroupChat.deleteOne({_id:chat._id}).exec()
            }
        })
        console.log("---Group Chat deleted---")
    }).catch(function(err){
        console.log(err)
        return res.status(400).json(({msg:"Fail to delete GroupChat"}))
    })

    //delete the user
    User.findOneAndDelete({_id:userObjectId}).then(function(user){
        console.log("USER DELETED")
        return res.status(200).json({msg:"User deleted!"})
    }).catch(function(err){
        console.log(err)
        return res.status(400).json({msg:"Fail to delete user"})
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
    if (req.body.changeUsername == "" && req.body.changeDescription == "" && req.body.photo == "" && req.body.changePassword == ""){
        return res.status(400).send({msg: "Please fill in the blanks if you want to update profile."})
    }
    else {
        User.findOne({ username: req.body.changeUsername }, (err, user) => {
            if (user){
                return res.status(401).send({msg: "Username existed. Please choose another username."})
            }  
        })

        User.findOne({ userId: req.params.userId, }, async (err, user) => {
            if(!user){
                return res.status(401).send({msg: "We cannot find this user to update."})
            }
            else {
                //username update
                if (req.body.changeUsername == ""){
                    user.username = req.body.username
                } else {user.username = req.body.changeUsername}
                //description update
                if (req.body.changeDescription == ""){
                    user.description = req.body.description
                } else {user.description = req.body.changeDescription}

                 //password update
                if (req.body.changePassword == ""){
                    user.password = req.body.password
                } 
                else {
                    const hashedPassword = await bcrypt.hash(req.body.changePassword, 10)
                    user.password = hashedPassword
                }

                //photo update
                user.photo = req.body.photo
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
})

//not done reset password
/* router.post("/admin/:userId/resetPw",async(req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    console.log(req.params.userId)
    User.findOne({userId:req.params.userId}).exec(function(err,results){
        if(err){
            console.log(err)
            res.status(400).json({msg:"sth goes wrong"})
        }else if (!results){
            res.status(400).json({msg:"This user doesn't exist"})
        }else{
            results.password = hashedPassword
            results.save()
            res.status(200).json({msg:"password changed"})
        }
    })
    
}) */
module.exports = router;