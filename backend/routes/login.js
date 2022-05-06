/* 
This file holds backend activities for login which include the following functions:
    1. login
*/

const router = require('express').Router();
let User = require("../models/user.model");
const bcrypt = require('bcryptjs')

//login
//input: email, password
router.post("/login", (req, res) => {
    if (req.body.email == "admin@gmail.com" && req.body.password == "admin") {
        return res.status(201).send({msg:'Admin successfully logged in.'});
    }
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err){
            return res.status(500).send({msg: err.message});
        } else if (!user){
            return res.status(401).send({ msg:'The email address ' + req.body.email + ' is not registered'});
        } else if (!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).send({msg:'Wrong Password!'});
        } else if (!user.isVerified){
            return res.status(401).send({msg:'Your Email has not been verified.'});
        } else{
            return res.status(200).send({msg:'User successfully logged in.',userId:user.userId});
        }
    })
})

module.exports = router;