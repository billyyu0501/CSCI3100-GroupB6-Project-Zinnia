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


import {Route,Routes,Link} from 'react-router-dom';



class Home extends React.Component{
    render(){
        return(
            <div className="container">
                <h1  > <Link to="/user">ZINNIA</Link></h1>
                <ul className = "nav nav-tabs justify-content-center">
                  
                    <Link to="/user/profile" className = "nav-link">Profile</Link>
                    <Link to="/user/searchUser" className = "nav-link">SearchUser</Link>
                    <Link to="/user/chat" className = "nav-link">Chat</Link>
                    <Link to="/" className = "nav-link">Logout</Link>
                </ul>
                <Routes>
                    <Route path = "/" element={<Forum />}/>
                    <Route path = "/profile" element={<Profile />}/>
                    <Route path = "/searchUser" element={<SearchUser/>}/>
                    <Route path = "/chat" element={< Chat/>}/>
                </Routes>

            
            </div>
        );
    }
}
export default Home