/*
This file holds backend activities for searching which include the following functions:
    1. Search specific user by username/userid 
    2. add friend
    3. view all friends a user have
*/

const router = require('express').Router();
let User = require("../models/user.model")
let getUserObjectId = require("../common").getUserObjectId;

//search for user by userId or username
//input: query [/search?userId=xxx OR /search?username=XXXX]
//return all user if query is not provided, the result are sorted in ascending order according to userId
router.get("/search",(req,res)=>{
    const {userId,username} = req.query
    let Field = {}
    if (userId !=null && username ==null){
        //The input of userId must be in integer
        if(!parseInt(userId)){
            return res.status(400).json({msg:"User Id must be a positive integer. Please enter again"})
        }
        Field = {userId:parseInt(userId)}
    }else if(userId == null && username != null){
        Field = {username:{$regex:username,$options:"i"}}
    }
    //console.log(Field)
    User.find(Field)
    .sort({userId:1})
    .exec(function(err,result){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json(result)
        }
    })
})

//invite friend, a warning message will be sent out if the users have already been invited or they are already in friend relationship
//body input: inviterId, inviteeId
router.post("/friend/invite",async (req,res)=>{
    inviterObjectId = await getUserObjectId(req.body.inviterId)
    inviteeObjectId = await getUserObjectId(req.body.inviteeId)
    //return if inviter or invitee is not found
    if (inviterObjectId==""){
        return res.status(400).json({msg:"inviter doesn't exist"})
    }
    if (inviteeObjectId==""){
        return res.status(400).json({msg:"invitee doesn't exist"})
    }
    User.findOne({_id:inviteeObjectId}).exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json({msg:"sth goes wrong"})
        }else{
            //console.log(results)
            if (JSON.stringify(results.friend).includes(JSON.stringify(inviterObjectId))){
                return res.status(400).json({msg:"This user has already been your friends"})
            }
            if (JSON.stringify(results.frdInvitation).includes(JSON.stringify(inviterObjectId))){
                return res.status(400).json({msg:"You have just sent this user an invitation. Please wait"})
            }
            results.frdInvitation.push({inviter:inviterObjectId,time:Date()})
            results.save()
            return res.status(200).json({msg:"Invitation are sent"})
        }
    })
    
})

//view all friend a user have
//params input: userId
router.get("/:userId/viewAllfrd", (req, res) => {
    //console.log(req.params.userId)
    User.findOne({userId:req.params.userId})
    .select("friend")
    .populate({path:"friend",select:["userId","username"]})
    .exec(function(err,results){
        if (err){
            console.log(err)
            res.status(400).json({msg:"Sth goes wrong"})
        }else{
            res.status(200).send(results)
        }
    })
})


module.exports = router;