/* 
1. list out all private chat that a specific user have [done][not check]
2. list out all group chat that a specific user have 
3. send message in a chat[done]/groupchat
4. create a private chat [done]
5. create a group chat 
6. update group member of a groupchat [for quit group]
7. del a group chat 
8. list out all message that a chat/groupchat have

*/
const router = require('express').Router();
let User = require("../models/user.model")
let {PrivateChat,GroupChat} = require("../models/chat.model") 
let getUserObjectId = require("../common")
//start a Private Chat

//check whether the Private Chat already existed by searching the 2 users
var IsPrivateChatExisted= async(users)=>{
    var existed = false
    try{
        const promise = await PrivateChat.find({user:{$all:users}})
        if (promise!="") existed = true
    }catch(err){
        console.log(err)
    }
    return existed
}
//create a new Private Chat
// body input: user1, user2
router.post("/private/createChat",async(req,res)=>{
    // if the inputed users are the same, return warning message
    if (req.body.user1 === req.body.user2){
        return res.status(400).json({msg:"User can't start a chat with himself"})
    }
    const user1 = await getUserObjectId(req.body.user1)
    const user2 = await getUserObjectId(req.body.user2)
    //if users doesn't exist, return warning message
    if(user1==""||user2==""){
        return res.status(400).json({msg:"The User doesn't exist"})
    }
    const existed = await IsPrivateChatExisted([user1,user2])
    //if the chat already exist, return warning message
    if (existed){
        return res.status(400).json({msg:"The chat has already existed"})
    }
    PrivateChat.create({user:[user1,user2]},function(err,results){
        if(err){
            res.json("Sth goes wrong")
        }else{
            res.json(results)
        }
    }) 
})

//view all Private Chat that the inputed user have
// The results are sorted in descending order by udpate time  
router.get("/private/:userId/viewAllChat",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.params.userId)
    if (userObjectId==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }
    PrivateChat.find({user:userObjectId})
    .sort({"updatedAt":-1})
    .populate({path:"user",select:["userId","username"]})
    .exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json(results)
        }
    })
})

// send message in a private chat
// body input: userId[speaker],chatObjectId, content
router.post("/private/sendMessage",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId)
    if (userObjectId==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }else if(req.body.content ==""){
        return res.status(400).json({msg:"The message can't be blank"})
    }
    PrivateChat.findOne({_id:req.body.chatObjectId}).exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            if(results==""){
                return res.status(400).json({msg:"This Chat doesn't exist"})
            }
            results.chatHistory.push({speaker:userObjectId,text:req.body.content,time:Date()})
            results.save()
            return res.status(200).json({msg:"Messages are sent"})
        }
    })
})

//display all message that a Private Chat have
//body input: userId?(need to discuss), ChatObjectId 
router.post("/private/displayMessage",async(req,res)=>{
    PrivateChat.findOne({_id:req.body.chatObjectId})
    .select(["chatHistory"])
    .sort({"chatHistory.time":-1})
    .populate("chatHistory.speaker",["username","userId"])
    .exec(function(err,results){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            res.status(200).json(results)
        }
    })
})
module.exports = router;