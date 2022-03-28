/*
This js is for the forum service
expected function:
1. Post
    ViewPost, editPost, newPost, display post 
2. Comment and like
    newComment, showComment,likePost,likeComment, 
*/ 
import React from "react";
import NewPost from "./NewPost";
import {Route,Routes} from 'react-router-dom';


class Forum extends React.Component{
    render(){
        return(
            <div className="container">
                <a href="/user/newpost" class="btn" style={{color:"white"}}> Create Post</a>

            <Routes>
                <Route path = "/user/newpost" element={<NewPost/>}/>
            </Routes>

            </div>
              
        );
    }
}

export default Forum