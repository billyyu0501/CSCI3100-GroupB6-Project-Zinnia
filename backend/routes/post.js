const router = require('express').Router();
let {Post, Comment} = require("../models/post.model");

let getUserObjectId = require("../common")
/*
1. create Post [done]
2. list out all post [done]
3. like post [done]  
4. create comment [done]
5. like comment [done]
6. list the content and all comment of a specific post [done]
7. search post by post title/post id [hold]
*/


//Post 

// create new post, 
// body input:[userId,title,content], warning are done
router.post("/createPost",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId);
    if (userObjectId ==""){
        res.status(400).json({msg:"User doesn't exist"})
    }else if(req.body.title == ""){
        res.status(400).json({msg:"Title can't be blank"})
    }else if(req.body.content == ""){
        res.status(400).json({msg:"Content can't be blank"})
    }else{
        Post.create({
            title:req.body.title,
            content: req.body.content,
            writer: userObjectId
        },function(err){
            if (err){
                console.log(err)
                res.status(400).json({msg:"sth goes wrong, can't post"})
            }else{
                res.status(200).json({msg:"Posted"})
            }
        })
    }
})

// list all posts, include titles, comment ,writerId and writer username
// no input is needed 
// The results are in descending order by time
router.get("/listAllPost",function(req,res){
    Post.find({})
    .sort({"updatedAt":-1})
    .populate({path:"writer",select:["userId","username"]})
    .exec(function(err,docs){
        if (err){
            console.log(err)
            res.status(400).json({msg:"sth goes wrong"})
        }else{
            res.status(200).json(docs)
        }
    })
})

// like a post, will distinguish whether the user has liked the post or not
//body input: [userId,postObjectId], warning are done
router.post("/likePost",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId);
    if (userObjectId ==""){
        res.status(400).json({msg:"User doesn't exist"})
    }
     Post.findOne({
        _id:req.body.postObjectId
    },function(err,post){
        if(err){
            console.log(err)
            res.status(400).json({msg:"sth goes wrong"})
        }else if (post == null){
            res.status(400).json({msg:"The post doesn't exist"})
        }else{
            const currentLike = post.like
            if (currentLike.includes(userObjectId)){
                res.status(200).json({msg:"Already liked this post"})
            }else{
                post.like.push(userObjectId)
                post.save()
                res.status(200).json({msg:"Liked!"})
            }
        }
    })
})

//Comment 

//adding new comment, body input:[postObjectId,userId,comment]
//Warning done: inexist UserId, blank comment, inexist PostObjectId
router.post("/comment",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId);
    if (userObjectId ==""){
        res.status(400).json({msg:"User doesn't exist"})
    }else if(req.body.comment == ""){
        res.status(400).json({msg:"comment can't be blank"})
    }else{
        Comment.create({
            commenter: userObjectId,
            comment: req.body.comment
        },function(err,comment){
            Post.findOne({_id:req.body.postObjectId})
            .exec(function(err,post){
                if(post == null){
                    Comment.deleteOne({_id:comment._id}).exec()
                    res.status(400).json({msg:"The post doesn't exist"})
                }else{
                    post.comment.push(comment._id)
                    post.save()
                    res.status(200).json({msg:"Commented Successfully"})
                }
            })
        })
    }
})

// like a comment, will distinguish whether the user has liked the comment or not
// body input: [userId, commentObjectId], warning are done
router.post("/likeComment",async(req,res)=>{
    const userObjectId = await getUserObjectId(req.body.userId);
    if (userObjectId ==""){
        res.status(400).json({msg:"User doesn't exist"})
    }
    Comment.findOne({
        _id:req.body.commentObjectId
    },function(err,comment){
        if(err){
            console.log(err)
            res.status(400).json({msg:"sth goes wrong"})
        }else if (comment == null){
            res.status(400).json({msg:"The comment doesn't exist"})
        }else{
            const currentLike = comment.like
            if (currentLike.includes(userObjectId)){
                res.status(200).json({msg:"Already liked this comment"})
            }else{
                comment.like.push(userObjectId)
                comment.save()
                res.status(200).json({msg:"Liked!"})
            }
        }
    })
})

// list all content of a specific post [title,content, writer, all comments]
// url link input, all comments are initially sorted at ascending order by time 
router.get("/post/:postObjectId",async(req,res)=>{
        Post.findOne({_id:req.params.postObjectId})
        .populate({path:"writer",select:["userId","username"]})
        .populate({
            path:"comment",
            populate:[
                {path:"commenter",select:["userId","username"]},
                {path:"like",select:['userId',"username"]}
            ],
            options:{sort:{"createdAt":1}}
        })
        .populate({path:"like",select:['userId',"username"]})
        .exec(function(err,result){
            if(err){
                res.status(400).json({msg:"Sth goes wrong"})
            }else if(result == null){
                res.status(400).json({msg:"The post doesn't exist"})
            }else{
                res.status(200).json(result)
            }
        })        
})

module.exports = router;