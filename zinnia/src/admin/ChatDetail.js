/*
    This file holds the content in one chat and it is directed from the ManageChat.js
    All chatHistory of that chat will be demonstrated and delete action can be performed in this page as well 
*/
import React from "react"
import moment from "moment"
import { deleteGroupChat,deletePrivateChat } from "./deleteFunc"
import {Navigate} from "react-router-dom"

const {REACT_APP_URL} = process.env;
export default class ChatDetail extends React.Component{
    constructor(props){
        super(props)
        this.state = {member:[],host:"",chatHistory:[],chatdf:{},redirect:false}
        this.handleDelete = this.handleDelete.bind(this)
    }
    // list the corresponding chat according to the chatType provided [Private or Group] when the Page is load
    // chatType is inherited from MangageChat.js
    async componentDidMount(){
        let params = JSON.stringify({chatObjectId:this.props.match.params.chatId})
        if(this.props.match.params.chatType == "group"){
            params = JSON.stringify({roomObjectId:this.props.match.params.chatId})
            //console.log("right")
        }
        //fetch all message of the chat and saved in chatdf
        await fetch(`${REACT_APP_URL}/${this.props.match.params.chatType}/displayMessage`,{
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: params,
            mode: 'cors'
        })
        .then(res =>res.json())
        .then(json=>{
            this.setState({chatdf:json})
            this.setState({chatHistory:json.chatHistory})
            if (this.props.match.params.chatType == "private"){
                this.setState({member:json.user})
            }else{
                this.setState({member:json.member,host:json.host})
            }
            //console.log(json)
        })
    }
    // delete the clicked chat and take the corresponding delete action according to its chatType
    async handleDelete(event){
        if(this.props.match.params.chatType == "group"){
            await deleteGroupChat(event.target.value)
        }else{
            await deletePrivateChat(event.target.value)
        }
        this.setState({redirect:true})

    }
    render(){
        return(
            <div className="container">
            <div className="d-flex justify-content-between">
            <h1>{this.props.match.params.chatType=="private"?"Private Chat":this.state.chatdf.room}</h1>
            <td><button type="button" onClick={this.handleDelete} value={this.props.match.params.chatId} className="btn-close btn-close-white" aria-label="Close"></button></td>
            </div>
            
            {this.props.match.params.chatType=="private"? null:
            <p>Host:{this.state.host.username}</p>}
            <div className="d-flex">
            <p className="m-2">Member: </p>
            {this.state.member.map((member,index)=>
                <div key ={index} className = "m-2">
                    <p className = "d-flex">{member.username}</p>    
                </div>
            )}
            </div>
        
            <h1>Chat History</h1>
            {this.state.chatHistory.map((message,index)=>
                <div key ={index} className="border-top border-bottom" >
                    <div className="d-flex justify-content-between">
                        <p>{message.speaker?message.speaker.username:"deleted User"}</p>
                        <p className="">{moment(message.createdAt).format("LLL")}</p>
                    </div>
                    <p>{message.text}</p>
                </div>
                )}
            {this.state.redirect?<Navigate to="/admin/ManageChat"/>:<></>}
            </div>
        )
    }
}
