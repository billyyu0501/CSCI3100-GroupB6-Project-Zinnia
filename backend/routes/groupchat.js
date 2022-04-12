/*
. create a group chat [done]
. list out all group chat that a specific user have [done]
. send message in a chat [done]
. del a group chat [done]
. quit group [done]
. invite member to the group (send notification to invited member )[done]
. accept/decline invitation [done]
. display all invitation [done]
. list out all message in a group [done]
*/

const Pusher = require('pusher');
const mongoose = require('mongoose');
const router = require('express').Router();
let User = require("../models/user.model")
let {GroupChat} = require("../models/chat.model") 
let getUserObjectId = require("../common").getUserObjectId
let getUsername = require("../common").getUsername;

const pusher = new Pusher({
    appId: "1368918",
    key: "9bfa9c67db40709d3f03",
    secret: "f08e4e49490ba7e38409",
    cluster: "ap1",
    useTLS: true
})

const db = mongoose.connection;
db.once('open', () => {
    // const groupCollection = db.collection('groupchats');
    // const groupCreateChangeStream = groupCollection.watch();
    // const memberModifiedChangeStream = groupCollection.watch([{
    //     $match: {
    //         $and: [
    //             { "updateDescription.updatedFields.member": { $exists: true } },
    //             { operationType: "update" }]
    //     }
    // }], { fullDocument: 'updateLookup' });
    // const chatInsertedChangeStream = groupCollection.watch([{
    //     $match: {
    //         $and: [
    //             { "updateDescription.updatedFields.chatHistory": { $exists: true } },
    //             { operationType: "update" }]
    //     }
    // }], { fullDocument: 'updateLookup' })
    // chatInsertedChangeStream.on("change", (change) => {
    //     db.collection('groupchats').find().sort({'updatedAt':-1}).toArray((err, results) => {
    //         const resultsDetails = results[0].chatHistory;
    //         const latestMessage = resultsDetails[resultsDetails.length-1];
    //         pusher.trigger('groupMessages', 'insertedGroupMessages',
    //         {
    //             speaker: {_id: latestMessage.speaker, userId: latestMessage.userId, username: latestMessage.username},
    //             text: latestMessage.text, time: latestMessage.time, _id: change.documentKey._id
    //         });
    //     });
    // })
    // groupCreateChangeStream.on("change", (change) => {
    //     if (change.operationType === 'insert') {
    //         const roomDetails = change.fullDocument;
    //         var host;
    //         User.findOne({_id:roomDetails.host}, (err, doc) => {
    //             host = doc;
    //             pusher.trigger('rooms', 'insertedRooms',
    //             {
    //                 chatHistory: [], createdAt: roomDetails.createdAt, updatedAt: roomDetails.updatedAt,
    //                 host: {_id:host._id, userId: host.userId, username: host.username},
    //                 member: [{_id:host._id, userId: host.userId, username: host.username}],
    //                 room: roomDetails.room, updatedAt: roomDetails.updatedAt, __v: roomDetails.__v, _id: roomDetails._id
    //             });
    //         })  
    //     }
    // });
    // memberModifiedChangeStream.on("change", (change) => {
        
    // })
    const groupCollection = db.collection('groupchats');   
    const groupChangeStream = groupCollection.watch();
    groupChangeStream.on("change", (change) => {
        console.log(change);
        if (change.operationType === 'update' && change.updateDescription.updatedFields.chatHistory) {
            db.collection('groupchats').find().sort({'updatedAt':-1}).toArray((err, results) => {
                const resultsDetails = results[0].chatHistory;
                const latestMessage = resultsDetails[resultsDetails.length-1];
                pusher.trigger('groupMessages', 'insertedGroupMessages',
                {
                    speaker: {_id: latestMessage.speaker, userId: latestMessage.userId, username: latestMessage.username},
                    text: latestMessage.text, time: latestMessage.time, _id: change.documentKey._id
                });
            });
        }
        if (change.operationType === 'insert') {
            const roomDetails = change.fullDocument;
            var host;
            User.findOne({_id:roomDetails.host}, (err, doc) => {
                host = doc;
                pusher.trigger('rooms', 'insertedRooms',
                {
                    chatHistory: [], createdAt: roomDetails.createdAt, updatedAt: roomDetails.updatedAt,
                    host: {_id:host._id, userId: host.userId, username: host.username},
                    member: [{_id:host._id, userId: host.userId, username: host.username}],
                    room: roomDetails.room, updatedAt: roomDetails.updatedAt, __v: roomDetails.__v, _id: roomDetails._id
                });
            })  
        }
    });
});

//create a group chat
//host is also inclued in the member array
//body input: hostId, room,   
router.post("/group/createGroup",async(req,res)=>{
    let hostObjectId = await getUserObjectId(req.body.hostId)
    let memberObjectId = []
    //push the host id to memberObjectId if it exists
    if (hostObjectId == ""){
        return res.status(400).json({msg:"The host user doesn't exist"}) 
    }
    memberObjectId.push(hostObjectId)

    //Create the groupchat
    GroupChat.create({
        host:hostObjectId,
        member:memberObjectId,
        room: req.body.room
    },function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json("Room: " + req.body.room + " is created")
        }
    })

})

//invite one member to a group [ can discuss see if multiple invitation at once is needed ] 
//body input: roomObjectId, invitedUser (in format, UserId)
router.post("/group/inviteMember",async(req,res)=>{
    //convert userId to userObjectId and check if it exists
    const userObjectId = await getUserObjectId(req.body.invitedUser)
    if (userObjectId == ""){
        return res.status(400).json({msg:"The user doesn't exist"}) 
    }

    //add the user into the group if he/she has not joint yet
    GroupChat.findOne({_id:req.body.roomObjectId}).exec(function(err,results){
        if (err){
            console.log(err)
            res.status(400).json({msg:"sth goes wrong"})
        }else{
            if (results.member.includes(userObjectId)){
                return res.status(400).json({msg:"The user has already been in this group"})
            }else{
                User.findOne({_id:userObjectId}).exec(function(err,user){
                    if(err){
                        console.log(err)
                        res.status(400).json({msg:"Sth goes wrong"})
                    }else{
                        if(JSON.stringify(user.gpInvitation).includes(req.body.roomObjectId)){
                            return res.status(400).json({msg:"Invitation has already been sent. Please wait for response"})
                        }else{
                            user.gpInvitation.push({room:req.body.roomObjectId,time:Date()})
                            user.save()
                            return res.status(200).json({msg:"Invitation is sent out "})
                        }
                    }
                })
            }
        }
    })
})

// user accept/reject group invitation
//body input: roomObjectId, userId, IsAccepted(boolean)
router.post("/group/acceptInvitation",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId)
    if (userObjectId==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }
    User.findOne({_id:userObjectId}).exec(function(err,results){
        if (err){
            console.log(err)
            res.status(400).json({msg:"Sth goes wrong"})
        }else{
            let existInvitation = false
            //pop out all invitation with the required inviter from the gpinvitation list 
            for(invitation of results.gpInvitation){
                if (invitation.room.equals(req.body.roomObjectId)){
                    //results.gpInvitation.pop(invitation)
                    results.gpInvitation = results.gpInvitation.filter(e=>!e.equals(invitation))
                    
                    results.save()
                    existInvitation = true
                }
            }
            // return if the invitation is not found in the list 
            if (existInvitation==false){
                return res.status(400).json({msg:"This Invitation doesn't exist"})
            }

            if(req.body.IsAccepted){
                GroupChat.findOne({_id:req.body.roomObjectId}).exec(function(err,room){
                    if(err){
                        console.log(err)
                        return res.status(400).json({msg:"Sth goes wrong"})
                    }else{
                        if (room==""){
                            return res.status(400).json({msg:"This room doesn't exist"})
                        }else{
                            room.member.push(userObjectId)
                            room.save()
                            return res.status(200).json({msg:"Accepted"})
                        }
                    }
                })
            }else{
                res.status(200).json({msg:"Rejected"})
            }  
        }
    })
})

// list all group invitation of a specific user
router.get("/:userId/gpInvitation",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.params.userId)
    if (userObjectId==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }
    User.findOne({_id:userObjectId},["username","userId","gpInvitation"])
    .populate({
        path:"gpInvitation",
        populate:{
            path:"room",
            select:["host","member","room"],
            populate:[
                {path:'host',select:["userId","username"]},
                {path:"member",select:["userId","username"]}
            ]
        },
        options:{sort:{'time':-1}}
    })  
    .exec(function(err,results){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json(results)
        }
    })
})

//delete a group (must be done by host)
//body input: userId, roomObjectId
router.post("/group/deleteGroup",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId)
    GroupChat.findOne({_id:req.body.roomObjectId}).exec(function(err,results){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"sth goes wrong"})
        }else{
            // return warning if it fail to search a post 
            if (results == null){
                return res.status(400).json({msg:"This group is not existed"})
            }
            //return msg if user is not the group host 
            if (!results.host.equals(userObjectId)){
                return res.status(400).json({msg:"Only host can delete the group"})
            }
            //delete the group 
            GroupChat.deleteOne({_id:req.body.roomObjectId},function(err){
                if (err){
                    console.log(err)
                    return res.status(400).json({msg:"sth goes wrong. Fail to delete the group"})
                }
                return res.status(200).json({msg:"Deleted"})
            })

        }
    })
})

//quit group (host cannot quit)
//body: userId, roomObjectId
router.post("/group/quitGroup",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId)
    GroupChat.findOne({_id:req.body.roomObjectId}).exec(function(err,results){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"sth goes wrong"})
        }else{
            // return warning if it fail to search a post 
            if (results == null){
                return res.status(400).json({msg:"This group is not existed"})
            }
            //return msg if user is the group host 
            if (results.host.equals(userObjectId)){
                return res.status(400).json({msg:"Host cannot quit group"})
            }
            //return warning if user is not the group member
            if (!JSON.stringify(results.member).includes(JSON.stringify(userObjectId))){
                return res.json({msg:"You are not in the group"})
            }
            // pop the userId out of the member array
            //results.member.pop(userObjectId)
            results.member = results.member.filter(e=>!e.equals(userObjectId))
            results.save()
            res.status(200).json({msg:"Quitted "})
        }
    })
})

//list all group that a specific user have 
router.get("/group/:userId/viewAllGroup",async(req,res)=>{
    //convert userId to userObjectId if it exists 
    const userObjectId = await getUserObjectId(req.params.userId)
    if (userObjectId==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }
    //find the group that the users have and sort in descending order(by time)
    GroupChat.find({member:userObjectId})
    .sort({"updatedAt":-1})
    .populate({path:"member",select:["userId","username"]})
    .populate("room")
    .exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json(results)
        }
    })
})

// send message in a group chat
// body input: userId[speaker],rooomObjectId, content
router.post("/group/sendMessage",async(req,res)=>{
    //convert UserId to UserObjectId if it exists. Check the content is blank or not
    const userObjectId = await getUserObjectId(req.body.userId)
    const username = await getUsername(req.body.userId);
    if (userObjectId==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }else if(req.body.text ==""){
        return res.status(400).json({msg:"The message can't be blank"})
    }
    // add message to ChatHistory of the corresponding group 
    GroupChat.findOne({_id:req.body.roomObjectId}).exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            if(results==""){
                return res.status(400).json({msg:"This Chat doesn't exist"})
            }else if (! results.member.includes(userObjectId)){
                return res.status(400).json({msg:"The user is not a member for this group"})
            }
            results.chatHistory.push({speaker:userObjectId,userId:req.body.userId,username:username,text:req.body.text,time:Date()})
            results.save()
            return res.status(200).json({msg:"Messages are sent"})
        }
    })
})

//display all message that a group Chat have
//body input: userId?(need to discuss), roomObjectId 
router.post("/group/displayMessage",async(req,res)=>{
    const new_id = mongoose.Types.ObjectId(req.body.roomObjectId);
    GroupChat.findOne({_id:new_id})
    .select(["chatHistory", "member"])
    .sort({"chatHistory.time":-1})
    .populate("chatHistory.speaker",["username","userId"])
    .populate("member", ["username", "userId"])
    .populate("room")
    .exec(function(err,results){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            res.status(200).json(results)
        }
    })
})

// get friendlist
router.post("/group/friendlist", async(req,res)=>{
    User.findOne({userId:req.body.userId})
    .select(["friend"])
    .populate("friend", ["username", "userId", "photo"])
    .exec((err, results) => {   
        if (err){
            console.log(err);
            return res.status(400).json({msg:"Sth goes wrong"});
        } else {
            return res.status(200).json(results);
        }
    })
})

module.exports = router;