/*
This js is for use management
Expected function:
reset password, search user, delete user, list all user
*/
import React from "react";
import {Link} from "react-router-dom"

const url = "http://localhost:8080"
class ManageUser extends React.Component{
    constructor(props){
        super(props);
        this.state={userdf:[]}
    }
    componentDidMount(){
        fetch(`${url}/search`,{
            method: "GET",
            headers: {
            'Content-Type': 'application/json'
            },
            mode: 'cors'
        })
        .then(res =>res.json())
        .then(json=>{
            this.setState({userdf:json})
        })

    }
    render(){
        return(
            <>
            <h2>Users</h2>
            <table className="table text-light">
                <thead>
                    <tr>
                        <th scope="col">UserId</th>
                        <th scope="col">Email</th>
                        <th scope="col">UserName</th>
                        <th scope="col">verified</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.userdf.map((user,index)=>
                <tr key ={index} >
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{!user.isVerified?"Not Yet":"done"}</td>
                    <td><Link to={`/admin/${user.userId}/profile`} className = "nav-link">Go to profile</Link></td>
                </tr>
                )}
                </tbody>
            </table>
            </>
            
        );
    }
}
export default ManageUser;