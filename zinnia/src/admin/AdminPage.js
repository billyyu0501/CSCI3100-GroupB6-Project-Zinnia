// This is the admin Home Page

import React from "react";
import {Route,Routes,Link, useParams,useLocation,useNavigate} from 'react-router-dom';
import ManageChat from "./ManageChat";
import ManagePost from "./ManagePost";
import ManageUser from "./ManageUser";
import UserDetail from "./UserDetail";
import Postdetail from "./Postdetail";
import ChatDetail from "./ChatDetail";
class Home extends React.Component{

    render(){
        const CallProfile = (props) =>{
            const params = useParams();
            return <UserDetail {...{...props,match:{params}}}/>
        }
        const CallPost = (props) =>{
            const params = useParams();
            return <Postdetail {...{...props,match:{params}}}/>
        }
        const CallChat =(props)=>{
            const params = useParams();
            return <ChatDetail {...{...props,match:{params}}}/>
        }
        return(
            <div>
                <h1>AdminPage</h1>
                <br/>
                <ul className = "nav nav-tabs text-light">
                    
                    <Link to="/admin" className = "nav-link">Manage User</Link>
                    <Link to="/admin/ManagePost" className = "nav-link">Manage Post</Link>
                    <Link to="/admin/ManageChat" className = "nav-link">Manage Chat</Link>
                    <Link to="/" className = "nav-link">Logout</Link>
                </ul>
                <br/>
                <Routes>
                    <Route path = "/" element={<ManageUser />}/>
                    <Route path = "/ManagePost" element={<ManagePost />}/>
                    <Route path = "/ManageChat/*" element = {<ManageChat/>}/>
                    <Route path = "/:userId/profile" element = {<CallProfile/>}/>
                    <Route path = "/:postId/post" element = {<CallPost/>}/>
                    <Route path = "/:chatId/:chatType" element = {<CallChat/>}/>
                </Routes>

            
            </div>
        );
    }
}
export default Home