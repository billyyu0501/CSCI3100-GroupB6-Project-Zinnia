/*
This js is for registration 
*/
import React from "react";
import {Link,Navigate} from "react-router-dom";
import FileBase64 from "react-file-base64";
import './Registration.css'

/*To-do list: 
(1)photo 
(2)warning handle(either do it here or throw to backend)
(3)email verification 
*/
class Registration extends React.Component{
    constructor(props){
        super(props);
        this.state={email:"",username:"",password:"",confirmPw:"",photo:"",IsWrong:false,alert:"",redirect:false}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFile = this.getFile.bind(this);
    }
    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
    }
    handleSubmit(event){
        event.preventDefault();
        //console.log(JSON.stringify({email: this.state.email,username:this.state.username,password: this.state.password,isAdmin:false,photo:this.state.photo}))
        if(this.state.email==="" || this.state.username==="" || this.state.password === ""||this.state.confirmPw ===""){
            this.setState({alert:"Please fill in all the blanks"})
            this.setState({IsWrong:true})
        }else if (this.state.password !== this.state.confirmPw){
            this.setState({alert:"Confirmed Password is not match with Password"})
            this.setState({IsWrong:true})
        }else{
            console.log(this.state.photo)
            this.setState({IsWrong:false})
            fetch("http://localhost:8080/register",{
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
/*
function Registration(){
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPw, setConfirmPw] = useState("")
    var [alert,setAlert] = useState("")
    var [IsWrong, SetIsWrong] = useState(true)
    var [data, setData] = useState("")
    const handleSubmit =(event)=>{
        event.preventDefault();
        console.log(email,username,password,confirmPw,data)
        if(email==="" || username==="" || password === ""||confirmPw ===""){
            alert = setAlert("Please fill in all the blanks")
        }else if (password !== confirmPw){
            alert = setAlert("Confirmed Password is not match with Password")
        }else{
            IsWrong = SetIsWrong(false)
        }   
        if (!IsWrong){
            console.log("go")
            IsWrong = SetIsWrong(true)
            fetch("http://localhost:8080/user/register",{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email,username:username,password: password,isAdmin:false}),
                mode: 'cors'
            })
            .then(response =>response.json())
            .then(df =>{
                setData(df)
                console.log(data)
            })
        }
    }
    return(
        <div>
            <h1>Registration</h1>
            <div className = "d-flex  align-middle">
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input type='text' value ={email} onChange={(e)=>setEmail(e.target.value)} className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Username:
                        <input type="text" value ={username} onChange={(e)=>setUsername(e.target.value)} className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input type='password' value ={password} onChange={(e)=>setPassword(e.target.value)}className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Confirmed Password:
                        <input type='password' value ={confirmPw} onChange={(e)=>setConfirmPw(e.target.value)}className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Photo:
                        <br/>
                    </label>
                    <br/><br/>
                    <div className="d-flex ">
                    <button type = 'submit'  className = "btn btn-primary">Login</button>
                    </div>
                    {IsWrong?<div className="text-danger">{alert}</div>:<></>}
                </form>
            </div>
            
            <br/>
            <Link to="/">Back to Login Page</Link>
        </div>
    )
}
*/
export default Registration