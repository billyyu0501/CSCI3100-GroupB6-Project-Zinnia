/* 
This is the home page of user interface, it can redirect to 
Forum, Chat, Profile and SearchUser. 
The logout button will be put on this page.

*/

import React from "react";

import Chat from "./Chat";
import Forum from "./Forum";
import Profile from "./Profile";
import SearchUser from "./SearchUser";

import {Switch, Route, BrowserRouter as Router, Link} from 'react-router-dom';


class Home extends React.Component{
    render(){
        return(
            <div>
                <h1>Zinnia</h1>
                <Router>
                <div>
                    <Link to="/">Forum</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/searchUser">Search User</Link>
                    <Link to="/chat">Chat</Link>
                    <Switch>
                        <Route exact path = "/"><Forum /></Route>
                        <Route exact path = "/profile"><Profile /></Route>
                        <Route exact path = "/searchUser"><SearchUser /></Route>
                        <Route exact path = "/chat"><Chat /></Route>
                    </Switch>
                </div>    
                </Router>
            </div>
        );
    }
}
export default Home