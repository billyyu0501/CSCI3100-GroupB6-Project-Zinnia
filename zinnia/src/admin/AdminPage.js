// This is the admin Home Page

import React from "react";
import {Route,Routes,Link} from 'react-router-dom';

import PostManage from "./PostManage";
import UserManage from "./UserMange";

class Home extends React.Component{
    render(){
        return(
            <div>
                <h1 className = "bg-light">AdminPage</h1>
                <ul className = "nav nav-tabs bg-light">
                    <Link to="/admin" className = "nav-link">Manage User</Link>
                    <Link to="/admin/postManage" className = "nav-link">Manage Post</Link>
                    <Link to="/" className = "nav-link">Logout</Link>
                </ul>
                <Routes>
                    <Route path = "/" element={<UserManage />}/>
                    <Route path = "/postManage" element={<PostManage />}/>
                    
                </Routes>

            
            </div>
        );
    }
}
export default Home