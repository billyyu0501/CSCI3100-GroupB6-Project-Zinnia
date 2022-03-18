/*
This js is for registration 
*/
import {React,useState,} from "react";
import {Link} from "react-router-dom"

/*To-do list: 
(1)photo 
(2)warning handle(either do it here or throw to backend)
(3)email verification 
*/
function Registration(){
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPw, setConfirmPw] = useState("")
    var [alert,setAlert] = useState("")
    var [IsWrong, SetIsWrong] = useState(true)
    var [data, setData] = useState(null)
    const handleSubmit =(event)=>{
        event.preventDefault();
        console.log(email,username,password,confirmPw)
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
                body: JSON.stringify({emailAddress: email,username:username,password: password,isAdmin:false}),
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
                        <input type='password' className = 'form-control' />
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
export default Registration