/*
This js is for forget password submit
*/

import React,{useState} from "react";
import {Link,Navigate,useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom"

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
        console.log(`http://localhost:8080/forgotpw/${email}/${token}`)
        if (password === ""){
            window.alert("Please fill in all the blanks")
        } else if (password !== passwordConfirm){
            window.alert("Confirmed Password is not match with Password")
        } else {
            await fetch(`http://localhost:8080/forgotpw/${email}/${token}`, {
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