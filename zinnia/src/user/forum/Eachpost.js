/*
This js is for the post details in each posts.
Number of likes and comments in each post will be shown.
Users can also like and add new comments.
*/ 
import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import './forum.css'
import Fromnow from 'react-fromnow';
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const {REACT_APP_URL} = process.env;


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "40px",
    
    borderTop:"30",
    backgroundColor: 'rgb(64,66,79)'
   
  }
}));

function Showpost(props){
    const {userId, postId} = useParams();
    const [postObjId, setPostObjId]= useState([]);
    const [title, setTitle]= useState([]);
    const [usersId, setUserId]= useState([]);
    const [username, setUserName]= useState([]);
    const [content, setContent]= useState([]);
    const [likes, setLikes]= useState([]);
    const [comment, setComment]= useState([]);
    const [createdAt, setCreatedAt]= useState([]);

    //set states for creating comment
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
    setOpen(true);
     };

    const handleClose = () => {
    setOpen(false);
     };

     //posting data to database when users "like" the post
     const likepost =async() =>{
       
       let data={
        userId:props.userId,
        postObjectId:postId
       }
       await fetch(`${REACT_APP_URL}/likePost`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(data),
        mode:"cors"

      })
      .then(res=>res.json())
      .then(res=>{
          window.alert(res.msg)
      })
      .catch((error)=>{
          window.alert("failed to like a post:"+error)
      });
      const reloadPage = () => {
        window.location.reload()
      }
      reloadPage();
      
    }
    
     //posting data to database when users "like" any comments of the post
    const likecomment =async(commentId) =>{
      
      let data={
       userId:props.userId,
       commentObjectId:commentId
      }
      await fetch(`${REACT_APP_URL}/likeComment`, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
           },
       body: JSON.stringify(data),
       mode:"cors"

     })
     .then(res=>res.json())
     .then(res=>{
        window.alert(res.msg)
        console.log(userId)
        console.log('liked a post',res)
     })
     .catch((error)=>{
         console.log('failed to like a post',error)
     });
     const reloadPage = () => {
       window.location.reload()
     }
     reloadPage();
   }

    //posting data to database when users comment on the post
   const addcomment =(text) =>{
    let data={
     userId:props.userId,
     postObjectId:postObjId,
     comment:text,
    }
    fetch(`${REACT_APP_URL}/comment`, {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json'
         },
     body: JSON.stringify(data),
     mode:"cors"

   })
   .then(res=>res.json())
   
   .then(res=>{

       console.log('posted a comment',res)
   })
   .catch((error)=>{
       console.log('failed to comment',error)
   });
   const reloadPage = () => {
     window.location.reload()
   }
   reloadPage();
 }

     //fetch all data of the posts from database (e.g. number of likes, comments, posts title, userId, etc.)

    useEffect(() =>{
        
        const fetchPost = async () => {
            const response = await fetch(`${REACT_APP_URL}/post/${postId}`);
            const res = await response.json();
            
                setPostObjId(res._id) 
                setTitle(res.title) 
                setUserId(res.writer.userId) 
                setUserName(res.writer.username) 
                setContent(res.content) 
                setLikes(res.like) 
                setComment(res.comment) 
                setCreatedAt(res.createdAt)
        };

        fetchPost(); 
    },[]);
   

    return(
        <>
      
      <a href="#"> <button  className="button" onClick={handleOpen} > Add Comment </button></a>
      <Dialog open={open}>
        <Box className={classes.paper}>
          <form
            onSubmit={(e) => {           
              e.preventDefault();
              addcomment(e.target[0].value);
              handleClose();
            }}>

            <div>
                <p style={{fontSize:24}}>Comment: #1 {title}</p>
              < textarea name="comment" type="text" id="comment" className="form-control" placeholder="Write Something..." rows={6} cols={100} autoFocus  required />
            </div>
       
              <button className="button" type="submit">Post</button>
              </form>
              <button className="button" onClick={()=>handleClose()}  > Cancel</button>
        
          
        </Box>
        </Dialog>
      
        <div style={{paddingTop:60}}/>
        <div className="card fixed-top" id="everypost">
          <div className="card-body">
            
                <h3>{title}</h3>
               
                <p > #1 <span style={{fontSize:20}} id="username">{username} </span><span style={{fontSize:14}}> - <Fromnow date ={createdAt}/></span></p>

                <p>{content}</p>
                <p> <i className="fa fa-thumbs-up fa-xs button" id="likebutton" onClick={()=>{likepost()}}> {likes.length}</i></p>
          </div>
        </div>
        {comment.map((comment,index)=>
        <div className="card" id="everycomment"key ={index} >

          <div className="card-body">
            <p > #{index+2} <span style={{fontSize:20}} id="username">{comment.commenter.username} </span><span style={{fontSize:14}}> - <Fromnow date ={comment.createdAt}/></span></p>
            <p>{comment.comment}</p>
            <p><i className="fa fa-thumbs-up fa-xs button" id="likebutton" onClick={()=>{likecomment(comment._id)}} > {comment.like.length}</i></p> 
          </div>
        </div>                
                )}
                
                <h4></h4>
          
        
        </>
    )
}

export {Showpost};



