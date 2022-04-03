import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import './forum.css'
import Fromnow from 'react-fromnow';
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import DialogTitle from '@mui/material/DialogTitle';


//import { border } from "@mui/material/node_modules/@mui/system";

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
                console.log(postObjId)
        };

        fetchPost(); 
        
        
    },[]);
   

    return(
        <>
      
      <a href="#"> <button  className="button"onClick={handleOpen} > Add Comment </button></a>


      <Dialog open={open}>
        <Box className={classes.paper}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleClose();
            }}>

            <div>
            

                <p>Comment: {title}</p>
              <textarea name="comment" id="commentbox" />
            </div>

              <button className="button" type="submit">Post</button>
        
          </form>
        </Box>
        </Dialog>
      
        <div style={{paddingTop:60}}/>
        <div className="card" id="everypost">
            <div className="card-body">
            
                <h3>{title}</h3>
               
                <p > #1 <span style={{fontSize:20}} id="username">{username} </span><span style={{fontSize:14}}> - <Fromnow date ={createdAt}/></span></p>

                <p>{content}</p>
                <p><i class="fa fa-thumbs-up fa-xs" >  {likes.length}</i></p>
                </div>
        </div>
                {comment.map((comment,index)=>
                
                    <div className="card" id="everypost"key ={index} >
                    <div className="card-body">
                    <p > #{index+2} <span style={{fontSize:20}} id="username">{comment.commenter.username} </span><span style={{fontSize:14}}> - <Fromnow date ={comment.createdAt}/></span></p>

              
                    <p>{comment.comment}</p>
                    <p><i class="fa fa-thumbs-up fa-xs"> {comment.like.length}</i></p>
                    
                    </div>
                    </div>
                
                )}
                
                <h4></h4>
                         
           
        
  
        
        </>
    )
}


// can't tale URL params by using Class component

class Eachpost extends React.Component{
    constructor(props){
        super(props);
        const {userId} = this.props.match.params;
        const {postId} = this.props.match.params;
        this.state={posts:[],userId:userId,postId:postId}
       
    }
  

    async componentDidMount(match){
        const USERID =this.props.location.pathname.substring(1)

        const search = this.props.location.search;
        const userId = new URLSearchParams(search).get("userId");
        const postId = new URLSearchParams(search).get('postId');
        const response = await fetch(`http://localhost:8080/post/${this.state.userId}/${this.state.postId}`)
        await response.json()
    
        .then(json=>{
            this.setState({posts:json})
            console.log(userId) 
        })
    }
    render(){
       
        return( 
        <div className="container">
            <h1>{this.state.postId}</h1>
           <h2>{this.state.userId} </h2>
        </div>            
        );
    }
}


export {Showpost};



