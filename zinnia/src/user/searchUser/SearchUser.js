/* 
This js is for Searching user
expected function:
1. search particular user by entering keyword and show the result.
2. Select particular user and start private chat/invite to group chat

*/


import React from "react";
import {Link} from "react-router-dom"
class SearchUser extends React.Component{
    constructor(props){
        super(props)
        this.state = {type:"userId",keyword:"",data:[],isSearch:false,frd:[]}
        this.handleSelect = this.handleSelect.bind(this)
        this.handleKeyword = this.handleKeyword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.invite = this.invite.bind(this)
        this.componentDidMount = this.componentDidMount(this)
    }
    async componentDidMount(){
        const response = await fetch(`http://localhost:8080/${this.props.userId}/viewAllfrd`);
        const res = await response.json();
        this.setState({frd:res.friend})
    }
    handleSelect(event){
        this.setState({type:event.target.value})
    }
    handleKeyword(event){
        this.setState({keyword:event.target.value})
    }
    async handleSubmit(event){
        event.preventDefault();
        await fetch(`http://localhost:8080/search?${this.state.type}=${this.state.keyword}`)
        .then((res) => res.json())
        .then((json) => {
            this.setState({ data: json,keyword:"",isSearch:true});
            //console.log(json);
      });
    }
    invite(event){
        fetch("http://localhost:8080/friend/invite",{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({inviterId:this.props.userId,inviteeId:event.target.value}),
                mode: 'cors'
            })
            .then(response =>{
                response.json().then(df=>{
                    window.alert(df.msg)
                })
            })
    }

    checkIsFrd(searchedId){
        let isFrd= false
        this.state.frd.find(element=>{
            if (element.userId==searchedId){
                isFrd = true
            }
        })
        return isFrd
    }
    render(){

        return(
            <div className="container">
            <h1>Search User</h1>
            <form class="form-inline d-flex justify-content-center" onSubmit={this.handleSubmit}>
                <div className="mx-sm-3 mb-2">
                    <select id ="type" onChange={this.handleSelect} className="form-select mx-sm-3 mb-2">
                        <option className="bg-white" value="userId">userId</option>
                        <option className="bg-white" value="username">username</option>
                    </select>
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <input type="text" className ="form-control" value = {this.state.keyword} onChange={this.handleKeyword} placeholder="keyword"/>
                </div>
                <div>
                    <button type="submit button" className =" btn btn-primary mx-sm-3 mb-2">Search</button>
                </div>
            </form>
            <table className={this.state.isSearch?"table text-light":"d-none"}>
                <thead>
                    <tr>
                        <th scope="col">UserId</th>
                        <th scope="col">Username</th>
                        <th scope="col">email</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                {this.state.data.map((user,index)=>
                <tr key ={index} >
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td><Link to={`/user/${this.props.userId}/searchUser/profile/${user.userId}`} className = "nav-link">Go to profile</Link></td>
                    <td>
                    {this.props.userId ==user.userId?null:
                        this.checkIsFrd(user.userId)?
                    <button className="btn btn-primary">Already Friend</button>:
                    <button className="btn btn-primary" value = {user.userId} onClick={this.invite}>Add Friend</button>
                    }
                    </td>
                </tr>
                )}
                </tbody>
            </table>
            {this.state.isSearch && this.state.data.length == 0?<h1>no match result</h1>:null}
            </div>
            
        );
    }
}
export default SearchUser