/**
This js is for login page.
It will link to registration, forgetPw ,admin and User Home Page 
according to users' action
*/

import React from "react";
import {Link,useNavigate} from "react-router-dom";

function LoginPage(){
    let navigate = useNavigate()
    const handleSubmit= ()=>{
        navigate("/user")
    }
    return(
        <>
        <div >
            <br/>
            <h3 className ="d-flex justify-content-center">Zinnia</h3>
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
                    <button type = 'submit'  className = "btn btn-primary">Login</button>
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



export default LoginPage

