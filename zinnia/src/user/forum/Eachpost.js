import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import './forum.css'
import Fromnow from 'react-fromnow';
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import DialogTitle from '@mui/material/DialogTitle';


//import { border } from "@mui/material/node_modules/@mui/system";
//the above link seems not work 
//import {border} from "@mui/system"

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "40px",
    
    borderTop:"30",
    backgroundColor: 'rgb(64,66,79)'
   
  }
}));

function Showpost(){
    const {userId, postId} = useParams();
    const [postObjId, setPostObjId]= useState([]);
    const [title, setTitle]= useState([]);
    const [usersId, setUserId]= useState([]);
    const [username, setUserName]= useState([]);
    const [content, setContent]= useState([]);
    const [likes, setLikes]= useState([]);
    const [comment, setComment]= useState([]);
    const [createdAt, setCreatedAt]= useState([]);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
    setOpen(true);
     };

    const handleClose = () => {
    setOpen(false);
     };

     const likepost =async() =>{
       
       let data={
        userId:userId,
        postObjectId:postId
       }
       await fetch('http://localhost:8080/likePost', {
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
    
    const likecomment =(commentId) =>{
      
      let data={
       userId:userId,
       commentObjectId:commentId
      }
      fetch('http://localhost:8080/likeComment', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
           },
       body: JSON.stringify(data),
       mode:"cors"

     })
     .then(res=>res.json())
     .then(res=>{
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
   const addcomment =(text) =>{
    let data={
     userId:userId,
     postObjectId:postObjId,
     comment:text,
    }
    fetch('http://localhost:8080/comment', {
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

    useEffect(() =>{
        
        const fetchPost = async () => {
            const response = await fetch(`http://localhost:8080/post/${postId}`);
            const res = await response.json();
            
                setPostObjId(res._id) 
                setTitle(res.title) 
                setUserId(res.writer.userId) 
                setUserName(res.writer.username) 
                setContent(res.content) 
                setLikes(res.like) 
                setComment(res.comment) 
                setCreatedAt(res.createdAt)
                console.log(res)
                console.log(res)
                console.log(postObjId)
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
              < textarea name="comment" id="commentbox" class="form-control" placeholder="Write Something..." rows={6} cols={100} autoFocus  />
            </div>
       
              <button className="button" type="submit">Post</button>
              <button className="button" > Cancel</button>
        
          </form>
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



