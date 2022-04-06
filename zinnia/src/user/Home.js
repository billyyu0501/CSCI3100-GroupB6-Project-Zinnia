/* 
This is the home page of user interface, it can redirect to 
Forum, Chat, Profile and SearchUser. 
The logout button will be put on this page.

*/

import React from "react";
import './home.css'

import Chat from "./chat/Chat";
import Forum from "./forum/Forum";
import Profile from "./profile/Profile";
import SearchUser from "./searchUser/SearchUser";
import NewPost from "./forum/NewPost";
import { Showpost } from "./forum/Eachpost";
import {Route,Routes,useNavigate,Navigate, useParams} from 'react-router-dom';
import LoginPage from "../login/LoginPage";
import Cookies from "universal-cookie";



class Home extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const CallRoute = (props)=>{
            let params = useParams().userId
            const cookie = new Cookies()
            let tokenUserId= cookie.get('userId')
            if (!tokenUserId){
                window.alert("please login first")
                return(<Navigate to="/"/>)
            }
            if (tokenUserId!=params){
                window.alert("You can't access other users' page")
                return <Navigate to="/"/>
            }
            return(
            <div className="container">
                <div style={{paddingTop:20}}/>
                <h1 style={{fontSize:45}}> <a href={`/user/${params}`}>ZINNIA</a></h1>
                <div className="icon-bar" >  
                    <a href="/" onClick={sessionStorage.clear()}><i className="fa fa-sign-out" ></i></a> 
                    <a href={`/user/${params}/profile`}><i className="fa fa-user"></i></a> 
                    <a href={`/user/${params}/chat`}><i className="fa fa-envelope"></i></a> 
                    <a href={`/user/${params}/searchUser`} ><i className="fa fa-search"></i></a> 
                </div>
               
           
                <Routes>
                    <Route path = "/*" element={<Forum userId={params}/>}/>
                    <Route path = "/profile" element={<Profile userId={params}/>}/>
                    <Route path = "/searchUser" element={<SearchUser userId={params}/>}/>
                    <Route path = "/chat" element={< Chat userId={params}/>}/>
                    <Route path = "/newpost" element={<NewPost userId={params}/>}/>
                    <Route path = "/post/:userId/:postId" element={<Showpost userId={params}/>}/>
                </Routes>
                </div>
            )
        }
        return(
            <CallRoute />  
        );
    }
}


        

export default Home