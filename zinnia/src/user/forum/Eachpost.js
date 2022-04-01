import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import './forum.css'
import Popup from "./Comment";
import axios from "axios";

/*
  
    useEffect(() =>{
        axios
        .get(`http://localhost:8080/post/${userId}/${postId}`)
        data2 = JSON.stringify(response)
        .then(res => {
            console.log(res.data)
            setPosts(data2)
        })
        .catch(err => {
            console.log(err)
        })
    },[])
   

*/

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

    const [openPopup, setOpenPopup] = useState(false)  //popout form failed
    
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
    <Popup
    title="Employee Form"
    openPopup={openPopup}
    setOpenPopup={setOpenPopup}
></Popup>
    

    return(
        <>
           
        <a href="/user"> <button  className="button" > Add Comment </button></a>
        <div style={{paddingTop:60}}/>
        <div className="card" id="everypost">
            <div className="card-body">
            
                <h3>{title}</h3>
                <p>{username} { createdAt}</p>
                <p>{content}</p>
                
                
                <h4></h4>
                         
            </div>
        </div>
        
  
        
        </>
    )
}

/*
1.
     {posts.map((postData)=>{
           <div>{postData.title}</div>

       }
       
       )}

2.
{posts.comment.map((posts)=>(
    <div>
        {posts.title}

    </div>
)
)}
*/



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


export {Eachpost,Showpost};



