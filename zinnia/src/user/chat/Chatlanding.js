import React from "react";
import './Chatlanding.css';
import Chat from "./private/Chat";
import Groupchat from "./group/Groupchat";
import {Route, Routes, Link} from 'react-router-dom';

function Chatlanding({userId}) {
    // routing component for private and group chat, page tabs for switching between private and group chat

    return (
        <React.Fragment>
            <div className="content">
                <ul className="nav nav-tabs text-light">
                    <Link to={`/user/${userId}/chat/private/0`} className = "nav-link">Private Chats</Link>
                    <Link to={`/user/${userId}/chat/group`} className = "nav-link">Group Chats</Link>
                </ul>
            </div>
            <Routes>
                <Route path = "/private/:id" element={<Chat user_id={userId}/>}/>
                <Route path = "/group" element={<Groupchat user_id={userId}/>}/>
            </Routes>
        </React.Fragment>
    )
}

export default Chatlanding;