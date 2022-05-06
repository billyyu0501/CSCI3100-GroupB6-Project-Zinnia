/*
    This page list all chats in the database. The chats listed are seperated to two types: private and group. 
    The chat shown can be switched between these two types of chat by vlicking corresponding button.
    It will direct to ChatDetail.js and view the detail of the chat by clicking corresponding button.
    Delete chat function can also be performed in this page.
*/
import React from "react";
import {Link,Routes,Route} from "react-router-dom";
import moment from "moment";
import { deletePrivateChat,deleteGroupChat} from "./deleteFunc";

const {REACT_APP_URL} = process.env;

// This class is used to hold class PrivateChat and GroupChat
// The page will show PrivateChat Component in default and switch to GroupChat Component when button is clicked
export default class ManageChat extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
            <ul className = "nav nav-tabs text-light">
                <Link to="/admin/ManageChat/" className = "nav-link">Private Chat</Link>
                <Link to="/admin/ManageChat/GroupChat" className = "nav-link">Group Chat</Link>
                </ul>
                <br/>
                <Routes>
                    <Route path = "/" element={<PrivateChat />}/>
                    <Route path = "/GroupChat" element={<GroupChat />}/>
                </Routes>
            </>
        )
    }
}

class PrivateChat extends React.Component{
    constructor(props){
        super(props);
        this.state = {data:[]}
        this.handleDelete = this.handleDelete.bind(this)
    }
    // fetch all data in private and saved in data
    componentDidMount(){
        fetch(`${REACT_APP_URL}/admin/private/viewAllChat`,{
                method: "GET",
                headers: {
                'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(json=>{
                console.log(json)
                this.setState({data:json})
                console.log(json[0].user[1])
            })
    }
    // delete private Chat 
    async handleDelete(event){
        console.log(event.target.value)
        await deletePrivateChat(event.target.value)
        this.componentDidMount()
    }
    render(){
        return(
            <div>
                <div className="d-flex justify-content-between">
                    <h1>Private Chat</h1>
                    <button type="button" className="btn btn-info" onClick={()=>{window.location.reload(false)}}>
                    <i className="bi bi-arrow-clockwise bg-info"/> refresh
                    </button>
                </div>
                
                <table className="table text-light">
                    <thead>
                        <th>Room Id</th>
                        <th>Member 1</th>
                        <th>Member 2</th>
                        <th>Updated At</th>
                    </thead>
                    <tbody>
                        {this.state.data.map((chat,index)=>
                        <tr key={index}>
                            <td>{chat._id}</td>
                            <td>{chat.user[0].username}</td>
                            <td>{chat.user[1].username}</td>
                            <td>{moment(chat.updatedAt).format("LLL")}</td>
                            <td><Link to={`/admin/${chat._id}/private`} className = "nav-link">Go to Chat</Link></td>
                            <td><button type="button" onClick={this.handleDelete} value={chat._id} className="btn-close btn-close-white" aria-label="Close"></button></td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

class GroupChat extends React.Component{
    constructor(props){
        super(props);
        this.state = {data:[]}
        this.handleDelete = this.handleDelete.bind(this)
    }

    //fetch all data in GroupChat database and saved in data
    componentDidMount(){
        fetch(`${REACT_APP_URL}/admin/group/viewAllChat`,{
                method: "GET",
                headers: {
                'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(json=>{
                console.log(json)
                this.setState({data:json})
            })
    }
    // delete groupChat
    async handleDelete(event){
        await deleteGroupChat(event.target.value)
        this.componentDidMount()
    }
    render(){
        return(
            <div>
                <div className="d-flex justify-content-between">
                    <h1>Group Chat</h1>
                    <button type="button" className="btn btn-info" onClick={()=>{window.location.reload(false)}}>
                    <i className="bi bi-arrow-clockwise bg-info"/> refresh
                    </button>
                </div>
                <table className="table text-light">
                    <thead>
                        <th>Group Id</th>
                        <th>Name</th>
                        <th>Host</th>
                        <th>Updated At</th>
                    </thead>
                    <tbody>
                        {this.state.data.map((group,index)=>
                        <tr key={index}>
                            <td>{group._id}</td>
                            <td>{group.room}</td>
                            <td>{group.host.username}</td>
                            <td>{moment(group.updatedAt).format("LLL")}</td>
                            <td><Link to={`/admin/${group._id}/group`} className = "nav-link">Go to Group</Link></td>
                            <td><button type="button" onClick={this.handleDelete} value={group._id} className="btn-close btn-close-white" aria-label="Close"></button></td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
