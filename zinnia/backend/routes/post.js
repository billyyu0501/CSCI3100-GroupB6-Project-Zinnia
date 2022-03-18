const router = require('express').Router();
const { application } = require('express');
let {Post, Comment} = require("../models/post.model");


router.post("/createPost",function(req,res){
    Post.create({
        title:"First Post",
        content:"This is the first post of Zinnia",
        writer:"62331d51cdc2a2da0f2c2f9f"
    },function(err){
        if (err){
            res.json("error")
        }else{
            res.json("Posted")
        }
    })
})



module.exports = router;