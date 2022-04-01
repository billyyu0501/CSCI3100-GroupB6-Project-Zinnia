/*
This js is for the post management
Expected function:
delete Post, display Post, searchPost, display comment,
searchComment, delete Comment 
*/

import React from "react";
import {Link} from "react-router-dom";
class ManagePost extends React.Component{
    constructor(props){
        super(props);
        this.state = {postdf:[]}
    }
    async componentDidMount(){
        fetch("http://localhost:8080/listAllPost",{
            method: "GET",
            headers: {
            'Content-Type': 'application/json'
            },
            mode: 'cors'
        })
        .then(res=>res.json())
        .then(json=>{
            this.setState({postdf:json})
            console.log(json)
        })
    }
    render(){
        return(
        <>
        <div>PostManage</div>
        <table className="table text-light">
                <thead>
                    <tr>
                        <th scope="col">PostId</th>
                        <th scope="col">title</th>
                        <th scope="col">Writer</th>
                        <th scope="col">verified</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.postdf.map((post,index)=>
                <tr key ={index} >
                    <td>{post._id}</td>
                    <td>{post.title}</td>
                    <td>{post.writer.username}</td>
                    <td>{post.createdAt}</td>
                    <td><Link to={`/admin/${post._id}/post`} className = "nav-link">Go to post</Link></td>
                </tr>
                )}
                </tbody>
            </table>
        </>
            
        );
    }
}
export default ManagePost;