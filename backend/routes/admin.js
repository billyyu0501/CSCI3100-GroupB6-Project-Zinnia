/*

1. del specific user 
2. del specific post 
3. del specific comment 

*/

const router = require('express').Router();
let User = require("../models/user.model");

/*
1. login
2. forgotPw
3. resetPw
4. Logout 
*/

router.get("/admin", (req, res) => {
    res.send("Testing login server")
})

module.exports = router;