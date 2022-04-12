/**
This js is for login page.
It will link to registration, forgetPw ,admin and User Home Page 
according to users' action
*/

import React from "react";
import {Link,Navigate,useNavigate} from "react-router-dom";
import { instanceOf } from "prop-types";
import Cookies from "universal-cookie"
const {REACT_APP_URL} = process.env;

class LoginPage extends React.Component{
    constructor(props){
        super(props)
        this.state = {email: "",
                      password: "",
                      isUser: false,
                      isAdmin: false,
                      userId: "",
                    }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)  
                  
    }
    //the cookie will expire in 30 min 
    setToken(userId, role){
        const d = new Date()
        const cookies = new Cookies()
        d.setTime(d.getTime() + 30*60*1000)
        cookies.set("userId",userId,{path:"/",expires:d})
        cookies.set("role",role,{path:"/",expires:d})
        
    }
    componentDidMount(){
        const cookies = new Cookies()
        if(cookies.get("userId")!=null){
            if(cookies.get("userId")!="admin"){
                this.setState({isUser:true,userId:cookies.get("userId")})
            }else{
                this.setState({isAdmin:true,userId:cookies.get("userId")})
            }
        }
    }
    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
        //console.log(this.state.email)
        //console.log(event.target.name)
        //console.log(event.target)
    }
    async handleSubmit(event){
        event.preventDefault();
        //console.log(this.state.email);
        //console.log(this.state.password);
        if (this.state.email === "" || this.state.password === ""){
            window.alert("Please fill in all the blanks")
        } else {
            await fetch(`${REACT_APP_URL}/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: this.state.email, password: this.state.password }),
                mode: 'cors'
            })
            .then(response => {
                response.json().then(df => {
                    window.alert(df.msg)
                    if (response.status==200){
                        this.setState({userId:df.userId})
                        this.setState({isUser:true})
                        //saved the login info in session 
                        this.setToken(this.state.userId,"user")
                    } else if (response.status==201){
                        this.setState({ isAdmin: true})
                        this.setToken("admin","admin")
                    }
                })
            })
        }
    }

    render(){

        return(
            <>
            {this.state.isAdmin?<Navigate to={`admin`}/>:<></>}
            {this.state.isUser?<Navigate to={`user/${this.state.userId}`}/>:<></>}
            <div >
                <br/>
                <h3 className ="d-flex justify-content-center">ZINNIA</h3>
                <br/>
                <div className = "d-flex justify-content-center align-middle">
                    <form onSubmit = { this.handleSubmit }>
                        <label>
                            Email:
                            <input type='email' name='email' value ={this.state.email} onChange={ this.handleChange } className='form-control' />
                        </label>
                        <br/>
                        <label>
                            Password:
                            <input type='password' name='password' value ={this.state.password} onChange={this.handleChange} className='form-control' />
                        </label>
                        <br/><br/>
                        <div className="d-flex justify-content-center">
                        <button type = 'submit'  className = "button">Login</button>
                        </div>
                    </form>
                </div>
                
                <br/>
                <div className="d-flex justify-content-center" id="login">
                    <li style={{ listStyleType: "none"}}><Link to="/registration" id="link" >Don't have an account?</Link></li>
                    
                    </div>
                    <div className="d-flex justify-content-center">
                    <li style={{ listStyleType: "none" }}><Link to="/forgotPassword"  id="link">Forgot Password?</Link></li>
                </div>
                <div style={{paddingTop:20}}> </div>
                <div className="d-flex justify-content-center">
                    <li style={{ listStyleType: "none" }}><Link to="/admin"  id="link" >Temporary Link for AdminPage</Link></li>
                </div>
            </div>    
            </>
        )
    }



}

/* function LoginPage(){
    let navigate = useNavigate()
    const handleSubmit= ()=>{
        navigate("/user")
    }
    return(
        <>
        <div >
            <br/>
            <h3 className ="d-flex justify-content-center">ZINNIA</h3>
            <br/>
            <div className = "d-flex justify-content-center align-middle">
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type='text' className = 'form-control' />
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input type='password' className = 'form-control' />
                    </label>
                    <br/><br/>
                    <div className="d-flex justify-content-center">
                    <button type = 'submit'  className = "button">Login</button>
                    </div>
                    
                </form>
            </div>
            
            <br/>
            <div className="d-flex justify-content-center">
                <li><Link to="/registration" >Don't have an account?</Link></li>
                <li><Link to="/forgotPassword" >Forgot Password?</Link></li>
            </div>
            <div className="d-flex justify-content-center">
                <li><Link to="/admin" >Temporary Link for AdminPage</Link></li>
            </div>
        </div>    
        </>
    )
}
 */


export default LoginPage

