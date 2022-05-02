/*
This js is for the main page of the forum
The following functions can be done in this page:

1. List Post
   All posts in the database are listed according to the newest changes made, likes of each posts will also be shown

2. Create Post
    Users can creat post by clicking the "create post" button

3. Seach Post
    Users can search every post by typing related keywords such as title, content of the posts and username

*/ 
import React from "react";
import './forum.css'
import Fromnow from 'react-fromnow';
const {REACT_APP_URL} = process.env;


class Forum extends React.Component{
    constructor(props){
        super(props);
        this.state={posts:[],showposts:[], likes:"",userId:this.props.userId}
        this.handleSearch = this.handleSearch.bind(this)
    }
    async componentDidMount(){
        const response = await fetch(`${REACT_APP_URL}/listAllPost`)
        await response.json()

        .then(json=>{
            this.setState({posts:json,showposts:json})
            console.log(json) 
        })   
    }
    handleSearch(event){
        this.setState({
            showposts:this.state.posts.filter(e=> e.writer.username.toLowerCase().includes(event.target.value.toLowerCase())||e.title.toLowerCase().includes(event.target.value.toLowerCase()))
        })
    }

    render(){
        return( 
        <div className="container">
            <a href={`/user/${this.props.userId}/newPost`}> <button  id ="createbutton"className="button" style={{color:"white"}}> Create Post </button></a>
            <div style={{paddingTop:60}}/>
            <div className="search-box"style={{fontSize:18}}>
                <i className="fa fa-search btn"></i>
                <input id="search" type="text" placeholder="Search" value={this.keyword} onChange={this.handleSearch}/>
            </div>
            <div style={{paddingTop:10}}/>
            {this.state.showposts.length==0?<h2>No match result</h2>:null}
            {this.state.showposts.map((post,index)=>{
                return <a href={`/user/${this.props.userId}/post/${post.writer.userId}/${post._id}`} key={index} id="postlink" >
                    <div className="card" id="forumpost">
                        <div className="card-body">
                            <p > <span style={{fontSize:20}} id="username">{post.writer.username} </span><span style={{fontSize:14}}> - <Fromnow date ={post.updatedAt}/></span></p>
                            <h4 id="postTitle">{post.title} </h4>
                            <p><i className="fa fa-thumbs-up fa-xs"> {post.like.length} </i></p>
                           
                        </div>
                    </div>
                    </a>
            })}
      </div>          
        );
    }
}

export default Forum
