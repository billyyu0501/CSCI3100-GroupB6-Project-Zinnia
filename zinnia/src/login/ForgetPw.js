/*
This js is for forget password
*/

import React from "react";
import {Link,Navigate,useNavigate} from "react-router-dom";
class ForgotPw extends React.Component{
    constructor(props){
        super(props)
        this.state = {email: "",redirect:false}
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        console.log(this.state)
    }
    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
    }

    async handleSubmit(event){
        event.preventDefault();
        console.log(this.state.email);
        if (this.state.email === ""){
            window.alert("Please fill in all the blanks")
        } else {
            await fetch("http://localhost:8080/forgotpw", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: this.state.email }),
                mode: 'cors'
            })
            .then(response => response.json())
            .then(df => {
                    window.alert(df.msg)
                    this.setState({redirect:true})
                    console.log(this.state.redirect)
                })
        }
    }
    render(){

        return(
            <>
            <div >
                <br/>
                <h3 className ="d-flex justify-content-center">ZINNIA</h3>
                <h3 className ="d-flex justify-content-center">Forgot Password</h3>
                <br/>
                <div className = "d-flex justify-content-center align-middle">
                    <form onSubmit = { this.handleSubmit }>
                        <label>
                            Email:
                            <input type='email' name='email' value ={this.state.email} onChange={ this.handleChange } className='form-control' />
                        </label>
                        <br/><br/>
                        <div className="d-flex justify-content-center">
                        <button type = 'submit'  className = "button">Submit</button>
                        </div>
                    </form>
                </div>
                {this.state.redirect?<Navigate to="/"/>:null}
            </div>    
            </>
        )
    }
}


export default ForgotPw