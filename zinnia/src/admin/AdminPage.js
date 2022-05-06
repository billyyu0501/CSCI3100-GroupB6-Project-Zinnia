/* 
    This is the admin Home Page and holds all routes of the admin application 
    It will direct to ManageChat, ManagePost and ManageUser Page by clicking the corresponding button
    and in default, ManageUser Page will be shown 
*/
import React from "react";
import {Route,Routes,Link, useParams,useLocation,Navigate} from 'react-router-dom';
import ManageChat from "./ManageChat";
import ManagePost from "./ManagePost";
import ManageUser from "./ManageUser";
import UserDetail from "./UserDetail";
import Postdetail from "./Postdetail";
import ChatDetail from "./ChatDetail";
import Cookies from "universal-cookie";

class Home extends React.Component{
    constructor(props){
        super(props)
        this.removeCookies = this.removeCookies.bind(this)
    }
    //clear cookies 
    removeCookies =() =>{
        const c= new Cookies()
        c.remove("userId", { path: '/' })
        c.remove("role", { path: '/' })
        console.log('remove')
    }
    render(){
        // inherit userId as param to UserDetail 
        const CallProfile = (props) =>{
            const params = useParams();
            return <UserDetail {...{...props,match:{params}}}/>
        }
        // inherit userId as param to PostDetail 
        const CallPost = (props) =>{
            const params = useParams();
            return <Postdetail {...{...props,match:{params}}}/>
        }
        // inherit userId as param to ChatDetail 
        const CallChat =(props)=>{
            const params = useParams();
            return <ChatDetail {...{...props,match:{params}}}/>
        }
        //back to login page if the user did not login 
        const BackToLogin = (props)=>{
            const cookie = new Cookies()
            let tokenUserId= cookie.get('userId')
            if (!tokenUserId){
                window.alert("please login first")
                return(<Navigate to="/"/>)
            }
            if (tokenUserId!="admin"){
                window.alert("You can't access admin page")
                return <Navigate to="/"/>
            }
            return <></>
        }
        return(
            <div>
                <h1>AdminPage</h1>
                <br/>
                <ul className = "nav nav-tabs text-light">
                    
                    <Link to="/admin" className = "nav-link">Manage User</Link>
                    <Link to="/admin/ManagePost" className = "nav-link">Manage Post</Link>
                    <Link to="/admin/ManageChat" className = "nav-link">Manage Chat</Link>
                    <Link to="/" className = "nav-link" onClick={this.removeCookies}>Logout</Link>
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
                <BackToLogin/>
            </div>
        );
    }
}
export default Home