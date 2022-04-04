const router = require('express').Router();
let User = require("../models/user.model");
const bcrypt = require('bcrypt')

/*
1. login [done]
2. forgotPw
3. resetPw
4. Logout [do it in frontend]
*/

//login
//input: email, password
router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err){
            return res.status(500).send({msg: err.message});
        } else if (!user){
            return res.status(401).send({ msg:'The email address ' + req.body.email + ' is not registered'});
        } else if (!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).send({msg:'Wrong Password!'});
        } else if (!user.isVerified){
            return res.status(401).send({msg:'Your Email has not been verified. Please click on resend'});
        } else{
            return res.status(200).send({msg:'User successfully logged in.',userId:user.userId});
        }
    })
})

module.exports = router;