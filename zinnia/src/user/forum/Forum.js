/*
This js is for the forum service
expected function:
1. Post
    ViewPost, editPost, newPost, display post 
2. Comment and like
    newComment, showComment,likePost,likeComment, 
*/ 
import React from "react";

class Forum extends React.Component{
    render(){
        return(
            <div class="container">
                <a href="/user" class="btn" style={{color:"white"}}> Create Post</a>



            </div>
        );
    }
}
export default Forum