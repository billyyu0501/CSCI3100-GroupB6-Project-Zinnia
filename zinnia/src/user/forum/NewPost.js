
import React from "react";
import './NewPost.css'




class NewPost extends React.Component{
    constructor(props){
        super(props);
        this.state={user:"3",title:props.title, content:props.content}

    }
    handleTitleChange(event){
     this.state.title = event.target.value;
     this.setState({ title: this.state.title });
        
    }

    handleContentChange(event){
        this.state.content = event.target.value;
        this.setState({ content: this.state.content });
           
       }

    async createPost (){
        let databody ={
            userId:"1",
            title: this.state.title,
            content: this.state.content
        }
        await fetch('http://localhost:8080/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(databody),
            mode:"cors"
        })
        .then(res=>res.json())
        .then(res=>{
            console.log('success',res)
        })
        .catch((error)=>{
            console.log('failed',error)
        });

            
    
    }

    render(){
        return(
            <div className="container">
                 <div style={{paddingTop:10}}/>
                <h3>Create Post</h3>
                <form method="POST"></form>
                <div class="form-group">
                    <label for="title" >Title</label>
                    <input type="text" onChange={this.handleTitleChange.bind(this)} name="title" id="title" class="form-control" required />
                </div>
                
                <div class="form-group">
                    <label for="content">Content</label>
                    <textarea name="content" onChange={this.handleContentChange.bind(this)} id="content" class="form-control" placeholder="Write Something..." rows={10} required></textarea>
                </div>
                <button type="submit" class="button" onClick={this.createPost} >Submit</button>
                <a href="/user"> <button class="button">Cancel </button> </a>

            
            
            
            </div>
        );
    }
}





export default NewPost


