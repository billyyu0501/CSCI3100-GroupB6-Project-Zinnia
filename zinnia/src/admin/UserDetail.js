import React from "react";
import {Buffer} from "buffer";
import { Link } from "react-router-dom";
import FileBase64 from "react-file-base64";
class UserDetail extends React.Component{
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
            console.log(this.state.img=="")
        })
    }
    render(){
        return(
            <div className="container">
            
            <h1>User Information</h1>
            <div className="d-flex flex-row">
                <div className = "p-2 border">
                <img className = 'p-2' width="250" height = "250" src ={this.state.img==""?"/img/blankProfilePic.png":this.state.img}/>
                </div>
                <table className = "p-2 table-bordered border text-white">
                    <tbody>
                        <tr>
                            <th>UserId</th>
                            <td>{this.state.data.userId}</td>
                        </tr>
                        <tr>
                            <th>Username</th>
                            <td>{this.state.data.username}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{this.state.data.email}</td>
                        </tr>
                        <tr>
                            <th>Verified</th>
                            <td>{this.state.data.isVerified?"True":"False"}</td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>{this.state.data.password}</td> 
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td>{this.state.data.description}</td>
                        </tr>
                        <tr>
                            <th>friends</th>
                            <td>{this.state.friend}</td>
                        </tr>
                    </tbody>                 
                </table>
            </div>
            <div>
                <h1>Update</h1>
            </div>
            <Link to="/admin/">Back to User</Link>
            </div>
            
        );
    }
}

export default UserDetail;