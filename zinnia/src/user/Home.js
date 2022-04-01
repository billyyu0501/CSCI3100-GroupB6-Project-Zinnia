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
import { Showpost, Eachpost } from "./forum/Eachpost";
import {Route,Routes} from 'react-router-dom';



class Home extends React.Component{
    render(){
        return(
            <div className="container">
                <h1 > <a href="/user">ZINNIA</a></h1>
                <div className="icon-bar" >  
                <a href="/" ><i className="fa fa-sign-out" ></i></a> 
                <a href="/user/profile"><i className="fa fa-user"></i></a> 
                <a href="/user/chat"><i className="fa fa-envelope"></i></a> 
                <a href="/user/searchUser" ><i className="fa fa-search"></i></a> 
                </div>


                <Routes>
                    <Route path = "/*" element={<Forum />}/>
                    <Route path = "/profile" element={<Profile />}/>
                    <Route path = "/searchUser" element={<SearchUser/>}/>
                    <Route path = "/chat" element={< Chat/>}/>
                    <Route path = "/newpost" element={<NewPost/>}/>
                    <Route path = "/post/:userId/:postId" element={<Showpost/>}/>
                </Routes>
            </div>
        );
    }
}


export default Home