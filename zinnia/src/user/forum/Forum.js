/*
This js is for the forum service
expected function:
1. Post
    ViewPost (OK), editPost (*), newPost (Post), display post (OK)
2. Comment and like
    newComment (POST), showComment (OK),likePost (*),likeComment (*), 
*/ 
import React from "react";
import './forum.css'
import Fromnow from 'react-fromnow';



class Forum extends React.Component{
    constructor(props){
        super(props);
        this.state={posts:[],revposts:[], likes:"",userId:""}
        this.setState({userId:this.props.userId})
    }

 
    async componentDidMount(){
        const response = await fetch(`http://localhost:8080/listAllPost`)
        await response.json()

        .then(json=>{
            this.setState({posts:json})
            console.log(json) 
            console.log(this.state.posts[0].writer.userId) 
        })
        
        this.setState({revposts:this.state.posts.reverse()})
    }

    render(){
        return( 
        <div className="container">
            <a href={`/user/${this.props.userId}/newPost`}> <button  id ="createbutton"className="button" style={{color:"white"}}> Create Post </button></a>
            <div style={{paddingTop:60}}/>
            
            {this.state.posts.map((post,index)=>{
                return <a href={`/user/${this.props.userId}/post/${post.writer.userId}/${post._id}`} key={index} id="postlink" >
                    <div className="card" id="forumpost">
                        <div className="card-body">
                            <p > <span style={{fontSize:20}} id="username">{post.writer.username} </span><span style={{fontSize:14}}> - <Fromnow date ={post.createdAt}/></span></p>
                            <h4 id="postTitle">{post.title} </h4>
                            <p><i class="fa fa-thumbs-up fa-xs"> {post.like.length} </i></p>
                           
                        </div>
                    </div>
                    </a>

                    })}
                    
            
      </div>
         
              
        );
    }
}



export default Forum