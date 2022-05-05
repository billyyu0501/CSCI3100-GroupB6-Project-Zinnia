/* 
This file holds backend activities for forget passord which include the following functions:
    1. forgot password 
    2. reset password 
*/

const router = require('express').Router();
const bcrypt = require('bcryptjs')
let User = require("../models/user.model")
const mongoose = require("mongoose");
let Token = require("../models/token.model")
const crypto = require('crypto');
const nodemailer = require('nodemailer');

//forgot password
//input: email
router.post("/forgotpw", (req,res) => {

    User.findOne({email: req.body.email}, (err, results) => {
        //email not existed
        if (results == null) {
            return res.status(400).json({msg: "email not existed."})
        }
        //email existed, send reset password email
        else{
            const token = Token.findOne({_id: results._id}, (err, token) => {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.AUTH_EMAIL,
                        pass: process.env.AUTH_PASSWORD
                    }
                })
            
                var mailOptions = { 
                    from: process.env.AUTH_EMAIL, 
                    to: results.email,
                    //to: "leoleung337.jp@gmail.com", 
                    subject: 'Forgot Password Reset Link', 
                    text: 'Hello,\n\n' + 'Please reset your password by clicking the link: \n http:\/\/localhost:3000\/forgotPassword\/' + results.email + '\/' + token.token + '\n\n Thank You!\n' };
                    transporter.sendMail(mailOptions, function (err) {
                    if (err) { 
                        return res.status(500).send({msg:'Something go wrong. Please try again later!'});
                    }
                    return res.status(200).send({msg: 'A reset password email has been sent to ' + results.email + '. Please check your email.'});
            
                })

            })
            
        }
    })
})

//reset password 
//input: the email link
router.post("/forgotpw/:email/:token", (req, res) => {
    Token.findOne({token: req.params.token}, (err, token) => {
        //check link
        if (!token){
            return res.status(400).send({msg: "Wrong Token!"})
        }
        else{
            User.findOne({_id: token._id, email: req.params.email},  async (err, user) => {
                if(!user){
                    return res.status(401).send({msg: "We cannot find this email for reset password."})
                }
                //update password
                else{
                    const hashedPassword = await bcrypt.hash(req.body.password, 10)
                    user.password = hashedPassword
                    user.save(() => {
                        if (err){
                            return res.status(500).send({msg: err.message});
                        }
                        else{
                            return res.status(200).send({msg: "Your password has been successfully reset"});

                        }
                    })
                }
            })
        }
    })
})


module.exports = router;