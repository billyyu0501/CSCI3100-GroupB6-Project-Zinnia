/*
1. read specific user info (everything except pw in user database)
2. udpate user info (photo, username, description) 
3. accept/reject friend invitation[done]
4. delete friends
*/

const router = require('express').Router();
let User = require("../models/user.model")
let getUserObjectId = require("../common").getUserObjectId;
const { json } = require('express');
let bcrypt = require("bcryptjs")
//get profile
router.get("/:userId/profile", (req, res) => {
    User.findOne({userId:req.params.userId})
    .populate({path:"friend",select:["userId","username","photo"]})
    .populate({path:"frdInvitation",populate:{path:"inviter",select:["userId","username"]},options:{sort:{"time":-1}}})
    .exec(function(err,results){
        if (err){
            console.log(err)
            res.status(400).json({msg:"Sth goes wrong"})
        }else{
            res.status(200).send(results)
        }
    })
})


//update profile
// body input: username, description 
router.post("/:userId/updateProfile", (req, res) => {
    User.findOneAndUpdate({userId:req.params.userId},{
        username: req.body.changeUsername,
        description: req.body.changeDescription,
        photo: req.body.changeImg
    },function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({msg:"Sth goes wrong"})
        }else{
            res.status(200).json({msg:"updated"})
        }
    })
})

//user resetPw
router.post("/:userId/resetPw",async(req,res)=>{
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
})

// accept/reject friend invitation
// input body: userId,inviterId, IsAccepted[boolean]
router.post("/friend/handleInvitation",async(req,res)=>{
    //convert userid to objectId and return if they are not exist
    userObjectId = await getUserObjectId(req.body.userId)
    inviterObjectId = await getUserObjectId(req.body.inviterId)
    if (userObjectId ==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }
    if (inviterObjectId ==""){
        return res.status(400).json({msg:"The inviter doesn't exist"})
    }
    //find the user first
    User.findOne({_id:userObjectId}).exec(function(err,results){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            let existInvitation = false
            //pop out all invitation with the required inviter from the invitation list 
            for(invitation of results.frdInvitation){
                if (invitation.inviter.equals(inviterObjectId)){
                    results.frdInvitation = results.frdInvitation.filter(e=>!e.equals(invitation))
                    results.save()
                    existInvitation = true
                }
            }
            // return if the invitation is not found in the list 
            if (existInvitation==false){
                return res.status(400).json({msg:"This Invitation doesn't exist"})
            }    
            // return if they are friends already
            // handle case that two users sent invitation to each other 
            if (results.friend!=null){
                if(results.friend.includes(inviterObjectId))
                    return res.status(400).json({msg:"You are already firends"})
            }
            // accepted invitation case
            if (req.body.IsAccepted){ 
                
                // push inviter id to user's friend list
                User.findOneAndUpdate({_id:userObjectId},{$push:{friend:inviterObjectId}}).exec(function(err){
                    if(err){
                        console.log(err)
                        return res.status(400).json({msg:"Sth goes wrong"})
                    }else{
                        //push user id to inviter's friend list 
                        User.findOneAndUpdate({_id:inviterObjectId},{$push:{friend:userObjectId}}).exec(function(err,inviterRes){
                            if(err){
                                console.log(err)
                                return res.status(400).json({msg:"Sth goes wrong"})
                            }else{
                                return res.status(200).json({msg:"Accepted"})
                            }
                        }) 
                    }
                })
            }
            //recepted invitation
            else{
                return res.status(400).json({msg:"Rejected"})
            }   
        }
    })
})

//delete friends
//input body: userId, friendId
router.post("/friend/delete",async(req,res)=>{
    //convert userid to objectId and return if they are not exist
    userObjectId = await getUserObjectId(req.body.userId)
    frdObjectId = await getUserObjectId(req.body.friendId)
    if (userObjectId ==""){
        return res.status(400).json({msg:"This user doesn't exist"})
    }
    if (frdObjectId ==""){
        return res.status(400).json({msg:"This friend doesn't exist"})
    }
    User.findOne({_id:userObjectId}).exec(function(err,results){
        if(err){
            console.log(err)
            return res.status(400).json("Sth goes wrong")
        }else{
            if(!JSON.stringify(results.friend).includes(JSON.stringify(frdObjectId))){
                return res.status(400).json({msg:"This user is not your friend"})
            }else{
                results.friend = results.friend.filter(e=>!e.equals(frdObjectId))
                results.save()
                User.findOne({_id:frdObjectId}).exec(function(err,frdres){
                if(err){
                    console.log(err)
                    res.status(400).json({msg:"Sth goes wrong"})
                }else{
                    if (frdres.friend!=null){
                        if(frdres.friend.includes(userObjectId)){
                            frdres.friend = frdres.friend.filter(e=>!e.equals(userObjectId))
                            frdres.save()
                        }
                    }
                    res.status(200).json({msg:"Deleted"})
                }})
            }
        }
    })
})

module.exports = router;