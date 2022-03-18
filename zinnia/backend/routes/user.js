const router = require('express').Router();
let User = require("../models/user.model")

/*

*/ 
router.get("/",function(req,res){
    res.send('get')
})

//create user
router.post("/register",function(req,res){
    console.log(req.body)
    var currentId = 1;
    User.findOne().sort({userId:-1}).exec(function(err,user){
        if(user!=null){currentId= user.userId +1}
        User.create({
            userId: currentId,
            username: req.body.username,
            isAdmin: req.body.isAdmin,
            password: req.body.password,
            emailAddress: req.body.emailAddress
        },function(err){
            if (err){
                res.json(Object.keys(err.keyPattern))
            }else{
                res.json("Account created ")
                console.log("created")
            }
        })
    })
})

module.exports = router;