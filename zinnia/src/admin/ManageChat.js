
import React from "react";
import {Link,Routes,Route} from "react-router-dom";

class ManageChat extends React.Component{
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
    }
    componentDidMount(){
        fetch("http://localhost:8080/admin/private/viewAllChat",{
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
    render(){
        return(
            <div>
                <h1>Private Chat</h1>
                <table className="table text-light">
                    <thead>
                        <th>Room Id</th>
                        <th>Member 1</th>
                        <th>Member 2</th>
                    </thead>
                    <tbody>
                        {this.state.data.map((chat,index)=>
                        <tr key={index}>
                            <td>{chat._id}</td>
                            <td>{chat.user[0].username}</td>
                            <td>{chat.user[1].username}</td>
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
    }
    componentDidMount(){
        fetch("http://localhost:8080/admin/group/viewAllChat",{
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
    render(){
        return(
            <div>
                <h1>Group Chat</h1>
                <table className="table text-light">
                    <thead>
                        <th>Group Id</th>
                        <th>Group Name</th>
                        <th>Host</th>
                    </thead>
                    <tbody>
                        {this.state.data.map((group,index)=>
                        <tr key={index}>
                            <td>{group._id}</td>
                            <td>{group.room}</td>
                            <td>{group.host.username}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default ManageChat;