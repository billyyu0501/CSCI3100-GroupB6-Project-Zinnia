/*
This js is for creating new post for the forum.
Title and content should not be blank in order to submit.
*/ 
import React from "react";
import './NewPost.css'
const {REACT_APP_URL} = process.env;


class NewPost extends React.Component{
    constructor(props){
        super(props);
        this.state={user:"3",title:"", content:"",userId:this.props.userId}
        this.handleTitleChange = this. handleTitleChange.bind(this)
        this.handleContentChange = this. handleContentChange.bind(this)
        this.createPost = this.createPost.bind(this)
    }
    handleTitleChange(event){
     this.setState({ title: event.target.value});
        
    }

    handleContentChange(event){
        this.setState({ content: event.target.value });
    }

    handleSubmit(event) {
        alert('Your Post' + this.state.title +"has been created!");
        event.preventDefault();
        this.createPost()
      }

    async createPost (){
        let databody ={
            userId:this.props.userId,
            title: this.state.title,
            content: this.state.content,
        }
        console.log(databody)
        
        await fetch(`${REACT_APP_URL}/createPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(databody),
            mode:"cors"
        })
        .then(res=>res.json())
        .then(res=>{
            window.alert(res.msg)
           
        })
        .catch((error)=>{
            console.log('failed',error)
        });
        window.location.assign(`/user/${this.props.userId}`)
        
    }

    render(){
        return(
            <div className="container">
                 <div style={{paddingTop:10}}/>
                <h3>Create Post</h3>
                <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label for="title" >Title</label>
                    <input type="text" value={this.state.title} onChange={this.handleTitleChange.bind(this)} name="title" id="title" className="form-control" required autoFocus />
                </div>
                
                <div className="form-group">
                    <label for="content">Content</label>
                    <textarea name="content" value={this.state.content} onChange={this.handleContentChange.bind(this)} id="content" className="form-control" placeholder="Write Something..." rows={10} required></textarea>
                </div>
                
                </form>
                <button type="submit" className="button" onClick={this.createPost}>Submit</button>
                <a href={`/user/${this.props.userId}`}> <button className="button">Cancel </button> </a>
            
            
            </div>
        );
    }
}





export default NewPost


