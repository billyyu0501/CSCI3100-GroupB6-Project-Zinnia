/*
This js is for the post management. 
It list out all posts in the database and can perform delete function by clicking the cross button.
It can also direct to Postdetail.js, which show the detail in the Post, by clicking the corresponding button. 
*/

import React from "react";
import {Link} from "react-router-dom";
import { deletePost } from "./deleteFunc";
var moment = require('moment')

const {REACT_APP_URL} = process.env;

class ManagePost extends React.Component{
    constructor(props){
        super(props);
        this.state = {postdf:[]}
        this.handleDelete = this.handleDelete.bind(this)
    }
    //fetch all post when the page is loaded
    componentDidMount(){
        fetch(`${REACT_APP_URL}/listAllPost`,{
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

    //delete Post function
    async handleDelete(event){
        await deletePost(event.target.value)
        this.componentDidMount()
    }
    render(){
        return(
        <>
        <div className=" m-2 d-flex justify-content-between">
            <h2 className="">Post</h2>
            <button type="button" className="btn btn-info" onClick={()=>{window.location.reload(false)}}>
                <i className="bi bi-arrow-clockwise bg-info"/> refresh
            </button>  
        </div>

        <table className="table text-light">
                <thead>
                    <tr>
                        <th scope="col">PostId</th>
                        <th scope="col">title</th>
                        <th scope="col">Writer</th>
                        <th scope="col">updated At</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.postdf.map((post,index)=>
                <tr key ={index} >
                    <td>{post._id}</td>
                    <td>{post.title}</td>
                    <td>{post.writer.username}</td>
                    <td>{moment(post.updatedAt).format("LLL")}</td>
                    <td><Link to={`/admin/${post._id}/post`} className = "nav-link">Go to post</Link></td>
                    <td><button type="button" onClick={this.handleDelete} value={post._id} className="btn-close btn-close-white" aria-label="Close"></button></td>
                </tr>
                )}
                </tbody>
            </table>
        </>
            
        );
    }
}
export default ManagePost;