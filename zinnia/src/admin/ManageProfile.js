import React from "react";
import {Buffer} from "buffer";
import { Link } from "react-router-dom";
import FileBase64 from "react-file-base64";
class ManageProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {userId:this.props.match.params.userId,data:[],img:"",Wrong:false}
        
    }
    async componentDidMount(){
        //console.log(this.state.userId)
        fetch(`http://localhost:8080/${this.state.userId}/profile`)
        .then(res=>res.json())
        .then(json=>{
            this.setState({data:json})
            //for test; can delete console log at final version 
            //console.log(json)
            //convert photo from buffer to base64 and save it in this.state.img
            this.setState({img:Buffer.from(this.state.data.photo,"base64").toString("ascii")})
        })
    }
    render(){
        return(
            <>
            <h1>User Information</h1>
            <div className="d-flex flex-row">
                <div className = "p-2">
                    <img width="250" height="250" src ={this.state.img}/>
                </div>
                <div className = "p-2">
                    <p>User ID: {this.state.data.userId}</p>
                    <p>User Name: {this.state.data.username}</p>
                    <p>Email Address: {this.state.data.email}</p>
                    <p>Password:  {this.state.data.password}</p> 
                    <p>Description:{this.state.data.description}</p>
                    <p>friends:{this.state.friend}</p>
                </div>
            </div>
            <div>
                <h1>Update</h1>
            </div>
            <Link to="/admin/">Back to User</Link>
            </>
            
        );
    }
}

export default ManageProfile;