/*
This js is for the profile overview
expected function:
1. display personal profile, including:
    userID, photo, email, UserName, description
2. edit profile, only the following items are allowed to be edited:
    photo, userName, description
3. Reset Password

*/
import React from "react";
import {Buffer} from "buffer";

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state={data:[],userId:"",img:""}
        console.log(this.props.userId)
    }
    async componentDidMount(){
        //get the userId and search the database by the UserId, async function is used as setState takes time
        const response = this.setState({userId:"2"})
        const getUserId = await response
        fetch(`http://localhost:8080/${this.state.userId}/profile`)
        .then(res=>res.json())
        .then(json=>{
            this.setState({data:json})
            //for test; can delete console log at final version 
            console.log(json)
            //convert photo from buffer to base64 and save it in this.state.img
            this.setState({img:Buffer.from(this.state.data.photo,"base64").toString("ascii")})
        })
    }
    render(){
        return(
            <>
            <h1>Profile</h1>
            <img width="250" height="250" src ={this.state.img}/>
            <p>User ID: {this.state.data.userId}</p>
            <p>User Name: {this.state.data.username}</p>
            <p>Email Address: {this.state.data.email}</p>
            <p>Password:   ***********</p> 
            <p>Description:{this.state.data.description}</p>
            
            </>
            
        );
    }
}
export default Profile