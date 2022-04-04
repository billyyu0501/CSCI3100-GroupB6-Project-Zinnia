/*
This js is for use management
Expected function:
reset password, search user, delete user, list all user
*/
import React from "react";
import {Link} from "react-router-dom"
import {deleteUser} from "./deleteFunc"

const url = "http://localhost:8080"
class ManageUser extends React.Component{
    constructor(props){
        super(props);
        this.state={userdf:[]}
        this.handleDelete = this.handleDelete.bind(this)
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
            console.log('get')
        })
    }
    async handleDelete(event){
        await deleteUser(event.target.value)
        this.componentDidMount()
    }
    render(){
        return(
            <>
            
            <div className=" m-2 d-flex justify-content-between">
            <h2 className="">Users</h2>
            <button type="button" className="btn btn-info" onClick={()=>{window.location.reload(false)}}>
                <i className="bi bi-arrow-clockwise bg-info"/> refresh
            </button>
            
            </div>
            
            <table className="table text-light">
                <thead>
                    <tr>
                        <th scope="col">UserId</th>
                        <th scope="col">username</th>
                        <th scope="col">email</th>
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
                    <td><button type="button" onClick={this.handleDelete} value={user.userId} className="btn-close btn-close-white" aria-label="Close"></button></td>
                </tr>
                )}
                </tbody>
            </table>
            </>
            
        );
    }
}
export default ManageUser;