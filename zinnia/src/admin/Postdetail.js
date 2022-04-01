//hold detail of individual post 

import React from "react";

class Postdetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {postId:this.props.match.params.postId,data:[],writer:{},comment:[]}
        //console.log(this.props.match.params)
        
    }
    async componentDidMount(){
        fetch(`http://localhost:8080/post/${this.state.postId}`)
        .then(res=>res.json())
        .then(json=>{
            this.setState({data:json})
            //for test; can delete console log at final version 
            console.log(this.state.data)
            this.setState({writer:this.state.data.writer})
            this.setState({comment:this.state.data.comment})
        })
    }
    render(){
        return(
            <div>
                <h1>{this.state.data.title}</h1>
                <hr/>
                <h2>{this.state.writer.username}</h2>
                <p>{this.state.data.content}</p>
                <p>Created at: {this.state.data.createdAt}</p>
                <br/>
                <hr/>
                <h2>Comment</h2>
                {this.state.comment.map((comment,index)=>
                <div key ={index} >
                    <h3>{comment.commenter.username}</h3>
                    <p>{comment.comment}</p>
                </div>
                )}
            </div>
        );
    }
}
export default Postdetail;