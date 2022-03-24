/*
1. read specific user info (everything except pw in user database)
2. udpate user info (photo, username, description) 
*/

const router = require('express').Router();
let User = require("../models/user.model")
let getUserObjectId = require("../common")
//get profile
router.get("/:userId/profile", (req, res) => {
    User.findOne({userId:req.params.userId})
    .exec(function(err,results){
        if (err){
            console.log(err)
            res.status(400).json("Sth goes wrong")
        }else{
            res.status(200).send(results)
        }
    })
})


//update profile
// body input: username, description 
router.post("/:userId/updateProfile", (req, res) => {
    User.findOneAndUpdate({userId:req.params.userId},{
        username: req.body.username,
        description: req.body.description
    },function(err,result){
        if(err){
            console.log(err)
            res.status(400).json("Sth goes wrong")
        }else{
            res.status(200).json("updated")
        }
    })
})

//udpate password 
//body input: hashedPassword
router.post("/:userId/resetPassword",(req,res) =>{
    User.findOneAndUpdate({userId:req.params.userId},{
        password: req.body.hashedpassword
    },function(err,result){
        if(err){
            console.log(err)
            res.status(400).json("Sth goes wrong")
        }else{
            res.status(200).json("updated")
        }
    })
})


module.exports = router;