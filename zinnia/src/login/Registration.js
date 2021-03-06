/*
    This js is for registration

*/
import React from "react";
import {Link,Navigate} from "react-router-dom";
import FileBase64 from "react-file-base64";
import './Registration.css'
const {REACT_APP_URL} = process.env;

class Registration extends React.Component{
    constructor(props){
        super(props);
        this.state={email:"",username:"",password:"",confirmPw:"",photo:"",IsWrong:false,alert:"",redirect:false}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFile = this.getFile.bind(this);
    }
    //handle change in the form 
    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
    }
    // function for submitting the registeration form 
    handleSubmit(event){
        event.preventDefault();
        // blank input is not allowed and password must be matched with confirm password
        if(this.state.email==="" || this.state.username==="" || this.state.password === ""||this.state.confirmPw ===""){
            this.setState({alert:"Please fill in all the blanks"})
            this.setState({IsWrong:true})
        }else if (this.state.password !== this.state.confirmPw){
            this.setState({alert:"Confirmed Password is not match with Password"})
            this.setState({IsWrong:true})
        }else{
            this.setState({IsWrong:false})
            // link to backend and wait for the response
            fetch(`${REACT_APP_URL}/register`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: this.state.email,username:this.state.username,password: this.state.password,photo:this.state.photo}),
                mode: 'cors'
            })
            .then(response =>{
                response.json().then(df=>{
                    window.alert(df.msg)
                    this.setState({redirect:true})
                    console.log(this.state.redirect)
                })
            })

        }   
    }
    // get the base64 format of the photo
    getFile(file){
        this.setState({photo:file.base64})
    }
    //check whether user has input a photo or not 
    HvPhoto(){
        if (this.state.photo != ""){
            return true
        }else{
            return false
        }
    }
    render(){
        return(
            <div>
            <h1> Account Registration</h1>
            <div style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                   
                        Photo:
                        <br/>
                        <img width="120" height = "120"src = {this.HvPhoto()?this.state.photo:"./img/blankProfilePic.png"}/>
                        <br/>
                        <FileBase64 multiple={false} onDone={this.getFile} />
                    
                    <br/>
                    <div >
                    <label id="email;">
                        Email:
                        <input type='text' name = 'email' value ={this.state.email} onChange={this.handleChange} className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Username:
                        <input type="text" name = "username" value ={this.state.username}  onChange={this.handleChange} className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input type='password' name = "password" value ={this.state.password} onChange={this.handleChange} className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Confirmed Password:
                        <input type='password' name = "confirmPw" value ={this.state.confirmPw}  onChange={this.handleChange} className = 'form-control' />
                    </label>
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center ">
                    <button type = 'submit button'  className = "button" id="register">Register </button>
                    </div>
                    {this.state.IsWrong?<div className="text-danger">{this.state.alert}</div>:<></>}
                </form>
            </div>
            
            <br/>
            <Link to="/" id="link" className="d-flex justify-content-center" >Back to Login Page</Link>
            {this.state.redirect?<Navigate to="/"/>:null}
        </div>    
        )
    }
}

export default Registration