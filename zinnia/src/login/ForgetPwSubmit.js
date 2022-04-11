/*
This js is for forget password submit
*/

import React,{useState} from "react";
import {Link,Navigate,useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom"
const {REACT_APP_URL} = process.env;
const ForgotPwSubmit= ()=>{
    const [password, setPassWord]= useState("");
    const [passwordConfirm, setpasswordConfirm]= useState("");
    const [redirect,setRedirect]= useState(false);
    let params = useParams();
    const email = params.email;
    const token = params.token;

    const handleChange=(event)=>{
        if (event.target.name=="password"){
            setPassWord(event.target.value)
        }else if (event.target.name =="passwordConfirm"){
            setpasswordConfirm(event.target.value)
        }
    }

    const handleSubmit = async(event)=>{
        event.preventDefault();
        console.log(`${REACT_APP_URL}/forgotpw/${email}/${token}`)
        if (password === ""){
            window.alert("Please fill in all the blanks")
        } else if (password !== passwordConfirm){
            window.alert("Confirmed Password is not match with Password")
        } else {
            await fetch(`${REACT_APP_URL}/forgotpw/${email}/${token}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password:password }),
                mode: 'cors'
            })
            .then(response => {
                response.json().then(df => {
                    window.alert(df.msg)
                    setRedirect(true)
                })
            })
            
        }
    }
    return(
        <>
        <div >
            <br/>
            <h3 className ="d-flex justify-content-center">ZINNIA</h3>
            <h3 className ="d-flex justify-content-center">Forgot Password Reset</h3>
            <br/>
            <div className = "d-flex justify-content-center align-middle">
                <form onSubmit = { handleSubmit }>
                    <label>Email:</label><br/>
                    <label>{email}</label><br/>
                    <label>Token:</label><br/>
                    <label>{token}</label><br/>
                    <label className="">
                        New Password:
                        <input type='password' name='password' value ={password} onChange={handleChange } className='form-control' />
                    </label>
                    <br></br>
                    <label>
                        Confirmed Password:
                        <input type='password' name='passwordConfirm' value ={passwordConfirm} onChange={handleChange } className='form-control' />
                    </label>
                    <br/><br/>
                    <div className="d-flex justify-content-center">
                    <button type = 'submit'  className = "button">Reset Password</button>
                    </div>
                </form>
            </div>
            {redirect?<Navigate to="/"/>:null}
        </div>    
        </>
    )         
}

export default ForgotPwSubmit


/*
class ForgotPwSubmit extends React.Component{
    constructor(props){
        super(props)
        this.state = {email: "",
                      token: "",
                      password: "",
                      passwordConfirm: ""}
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
    }

    async handleSubmit(event){
        event.preventDefault();
        console.log(this.state.email);
        console.log(this.state.password);
        console.log(this.state.token);
        console.log(`http://localhost:8080/forgotpw/${this.state.email}/${this.state.token}`)
        if (this.state.password === ""){
            window.alert("Please fill in all the blanks")
        } else if (this.state.password !== this.state.passwordConfirm){
            window.alert("Confirmed Password is not match with Password")
        } else {
            await fetch(`http://localhost:8080/forgotpw/${this.state.email}/${this.state.token}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: this.state.password }),
                mode: 'cors'
            })
            .then(response => {
                response.json().then(df => {
                    window.alert(df.msg)
                })
            })
        }
    }
    render(){  
            return(
                <>
                <div >
                    <br/>
                    <h3 className ="d-flex justify-content-center">ZINNIA</h3>
                    <h3 className ="d-flex justify-content-center">Forgot Password Reset</h3>
                    <br/>
                    <div className = "d-flex justify-content-center align-middle">
                        <form onSubmit = { this.handleSubmit }>
                            <label>
                                Email:
                                <input type='email' name='email' value ={this.state.email} onChange={ this.handleChange } className='form-control' />
                            </label>
                            <br></br>
                            <label>
                                New Password:
                                <input type='password' name='password' value ={this.state.password} onChange={ this.handleChange } className='form-control' />
                            </label>
                            <br></br>
                            <label>
                                Confirmed Password:
                                <input type='password' name='passwordConfirm' value ={this.state.passwordConfirm} onChange={ this.handleChange } className='form-control' />
                            </label>
                            <br></br>
                            <label>
                                Token:
                                <input type='text' name='token' value ={this.state.token} onChange={ this.handleChange } className='form-control' />
                            </label>
                            <br/><br/>
                            <div className="d-flex justify-content-center">
                            <button type = 'submit'  className = "button">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>    
                </>
            )
        }
    }
    

export default ForgotPwSubmit

*/
