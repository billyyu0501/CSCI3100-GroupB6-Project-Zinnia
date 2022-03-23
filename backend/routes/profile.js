/*
1. read specific user info (everything except pw in user database)
2. udpate user info (photo, username, description) 
*/

const router = require('express').Router();
let User = require("../models/user.model")

//get profile
router.get("/profile", (req, res) => {

})


//update profile
router.post("/profile", (req, res) => {

})