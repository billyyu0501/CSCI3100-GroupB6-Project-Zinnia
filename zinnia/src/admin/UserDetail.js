import React from "react";
import {Buffer} from "buffer";
import { Link } from "react-router-dom";
import FileBase64 from "react-file-base64";
class UserDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userId:this.props.match.params.userId,
            data:[],
            img:"",
            update:false,
            change:{username:"",description:"",isVerified:null}
        }
        this.handleUpdate = this.handleUpdate.bind(this)
        this.cancelUpdate = this.cancelUpdate.bind(this)
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
    handleUpdate(){
        this.setState({update:true})
    }
    cancelUpdate(){
        this.setState({update:false})   
    }
    handleSubmit(){
        console.log("submit")
    }
    handleChange(){
        console.log("change")
    }
    render(){
        return(
            <div className="container">
            <div>
                <Link to="/admin/">Back to User</Link>
                <h1>User Information</h1>
            </div>
            <div className={this.state.update?"d-none":""}>
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
                <br></br>
                <div>
                    <button className="btn btn-primary" onClick={this.handleUpdate}>Update</button>
                </div>
            </div>
            
            
            <div className={this.state.update?"":"d-none"}>
                <div className = "d-flex  align-middle">
                    <form onSubmit={this.handleSubmit} className="d-flex">
                        <div id = "photo">
                            <label>
                                <img width="250" height = "250"src = {this.state.img==""?"/img/blankProfilePic.png":this.state.img}/>
                                <FileBase64 multiple={false} onDone={this.getFile} />
                            </label>
                        </div>
                        <div id = "input">
                            <label>UserId: {this.state.data.userId}</label>
                            <br/>
                            <label>Email: {this.state.data.email}</label>
                            <br/>
                            <label>
                                Username:
                                <input type="text" name = "username" value ={this.state.change.username}  onChange={this.handleChange} className = 'form-control' />
                            </label>
                            
                            <label>
                                description:
                                <input type='text' name = "password" value ={this.state.change.description} onChange={this.handleChange} className = 'form-control' />
                            </label>
                           
                            <label>
                                isVerified:
                                <input type='text' name = "confirmPw" value ={this.state.change.isVerified}  onChange={this.handleChange} className = 'form-control' />
                            </label>
                            
                            <div className="d-flex ">
                            <button type = 'submit'  className = "btn btn-primary">Update</button>
                            <button className="btn btn-primary" onClick={this.cancelUpdate}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
            </div>                        
        );
    }
}

export default UserDetail;