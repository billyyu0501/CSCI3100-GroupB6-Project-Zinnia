import React from "react";
import {Buffer} from "buffer";
import { Link } from "react-router-dom";
import FileBase64 from "react-file-base64";
const {REACT_APP_URL} = process.env;
class UserDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userId:this.props.match.params.userId,
            data:[],
            friend:[],
            photo:"",
            update:false,
            changeUsername:"",
            changeDescription: "",
            changePassword: "",
            showfrd: false,
        }
        this.getFile = this.getFile.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this)
        this.cancelUpdate = this.cancelUpdate.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFrdList = this.handleFrdList.bind(this)
        
    }
    async componentDidMount(){
        //console.log(this.state.userId)
        fetch(`${REACT_APP_URL}/${this.state.userId}/profile`)
        .then(res=>res.json())
        .then(json=>{
            this.setState({data:json,friend:json.friend})
            this.setState({photo:Buffer.from(this.state.data.photo,"base64").toString("ascii")})        
            //console.log(this.state.photo)
        })
    }
    getFile(file){
        this.setState({photo:file.base64})
    }
    handleUpdate(){
        this.setState({update:true})
    }
    cancelUpdate(){
        this.setState({update:false})   
    }
    handleFrdList(event) {
        if (this.state.showfrd) {
          this.setState({ showfrd: false });
        } else {
          this.setState({ showfrd: true });
        }
      }
    async handleSubmit(event){
        event.preventDefault();
        console.log(this.state.userId);
        await fetch(`${REACT_APP_URL}/admin/${this.state.userId}/profile`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ changeUsername: this.state.changeUsername,
                                   changeDescription: this.state.changeDescription,
                                   changePassword: this.state.changePassword,
                                   photo: this.state.photo,
                                   username: this.state.data.username,
                                   description: this.state.data.description,
                                   password: this.state.data.password
                                }),
            mode: 'cors'
        })
        .then(response => response.json())
        .then(df => {
                window.alert(df.msg)
                window.location.reload(false)
            })
        
    }
    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
        //console.log(this.state.changeUsername)
        //console.log(this.state.changeDescription)
        //console.log(this.state.changePassword)
    }
    render(){
        return(
            <div className="container">
            <div>
                <Link to="/admin/">Back to User</Link>
                <h1>User Information</h1>
            </div>
            <div className={this.state.update?"d-none":""}>
                <div className="d-flex flex-row justify-content-center">
                    <div className = "p-2 border">
                    <img className = 'p-2' width="250" height = "250" src ={this.state.photo==""?"/img/blankProfilePic.png":this.state.photo}/>
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
                                <th>Description</th>
                                <td>{this.state.data.description}</td>
                            </tr>
                        </tbody>                 
                    </table>
                </div>
                <br></br>
                <div className="d-flex p-2">
                    <h2 className="m-2">Friend list</h2>
                    <button
                        className={
                        this.state.showfrd
                            ? "btn btn-secondary btn-sm bi bi-chevron-up m-2"
                            : "btn btn-secondary btn-sm bi bi-chevron-down m-2"
                        }
                        onClick={this.handleFrdList}
                    ></button>
                </div>
                <div className={this.state.showfrd ? "" : "d-none"}>
                    {this.state.friend.map((frd, index) => (
                        <div className="friend" key={index}>
                        <div className="row">
                            <div className="col-2">
                            <img
                                src={
                                frd.photo.data.length == 0
                                    ? "/img/blankProfilePic.png"
                                    : Buffer.from(frd.photo, "base64").toString("ascii")
                                }
                                className="rounded-circle profile-photo"
                            />
                            </div>
                            <div className="col-8">
                            <span className="text-muted">#{frd.userId} </span>
                            <span className="h5">
                                {frd.username}
                            </span>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
                <div>
                    <button className="btn btn-primary" onClick={this.handleUpdate}>Update</button>
                </div> 
            </div>
       
            <div className={this.state.update?"":"d-none"}>
                <div className = "">
                    <form onSubmit={this.handleSubmit} className="">
                        <div id = "photo">
                            <label>
                                <img width="250" height = "250"src = {this.state.photo==""?"./img/blankProfilePic.png":this.state.photo}/>
                                <br/>
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
                                <input type="text" name = "changeUsername" value ={this.state.changeUsername}  onChange={this.handleChange} className = 'form-control' />
                            </label>
                            <br/>
                            <label>
                                Password:
                                <input type='password' name = "changePassword" value ={this.state.changePassword} onChange={this.handleChange} className = 'form-control' />
                            </label>
                            <br/>
                            <label>
                                Description:
                                <textarea name = "changeDescription" value ={this.state.changeDescription} onChange={this.handleChange} className = 'form-control' />
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