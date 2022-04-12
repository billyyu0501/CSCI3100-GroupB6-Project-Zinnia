/* 
This js is for Searching user
expected function:
1. search particular user by entering keyword and show the result.
2. Select particular user and start private chat/invite to group chat

*/


import React from "react";
import {Link} from "react-router-dom"
import "./searchUser.css"

import {Buffer} from "buffer"
const {REACT_APP_URL} = process.env;
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
        const response = await fetch(`${REACT_APP_URL}/${this.props.userId}/viewAllfrd`);
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
        await fetch(`${REACT_APP_URL}/search?${this.state.type}=${this.state.keyword}`)
        .then((res) => {
            if (res.status!=200){
                res.json().then(df=>{
                    window.alert(df.msg)
                })
            }else{
                res.json().then(df=>{
                    this.setState({ data: df,keyword:"",isSearch:true});
                    //console.log(df)
                })
            }
      });
    }
    invite(event){
        fetch(`${REACT_APP_URL}/friend/invite`,{
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
            <div style={{paddingTop:10}}/>
            <form className="form" onSubmit={this.handleSubmit}>
                <div className="mx-sm-3 mb-2 align-self-center">
                    <select id="select" onChange={this.handleSelect} className="form-select mx-sm-3 mb-2">
                        <option   value="userId">userId</option>
                        <option   value="username">username</option>
                    </select>
                </div>
                <div className="search-box mx-sm-3 mb-2">
                    <input id="search" type="text" className ="form-control" value = {this.state.keyword} onChange={this.handleKeyword} placeholder="keyword"/>
                    <button type="submit" className ="fa fa-search btn"></button>
                </div>
            </form>
            <div style={{paddingTop:10}}/>
            {this.state.data.map((user, index) => (
                <div className="friend" key={index}>
                  <div className="row">
                    <div className="col-2">
                      <img
                        src={
                          user.photo.data.length == 0
                            ? "/img/blankProfilePic.png"
                            : Buffer.from(user.photo, "base64").toString("ascii")
                        }
                        className="rounded-circle profile-photo"
                        />
                    </div>
                    <div className="col-8">
                      <span className="text-muted">#{user.userId} </span>
                      <span className="h5">
                        <Link
                          to={`/user/${this.props.userId}/searchUser/profile/${user.userId}`}
                        >
                          {user.username}
                        </Link>
                      </span>
                    </div>
                    <div className="col-2">
                    {this.props.userId ==user.userId?null:
                        this.checkIsFrd(user.userId)?
                    <button className="btn btn-primary ">Friend</button>:
                    <button className="btn btn-primary " value = {user.userId} onClick={this.invite}>Invite</button>
                    }
                    </div>
                  </div>
                </div>
              ))}
            {this.state.isSearch && this.state.data.length == 0?<h1>no match result</h1>:null}
            </div>
            
        );
    }
}
export default SearchUser