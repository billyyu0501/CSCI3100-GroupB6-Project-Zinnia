/*
1. Search specific user by username/userid 
*/

const router = require('express').Router();
let User = require("../models/user.model")

router.get("/search",(req,res)=>{
    const {userId,username} = req.query
    let Field = {}
    if (userId !=null && username ==null){
        Field = {userId:userId}
    }else if(userId == null && username != null){
        Field = {username:username}
    }
    //console.log(Field)
    User.find(Field).exec(function(err,result){
        if (err){
            console.log(err)
            return res.status(400).json({msg:"Sth goes wrong"})
        }else{
            return res.status(200).json(result)
        }
    })
})


module.exports = router;