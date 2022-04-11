/* 
This js is the chatroom service
expected function:
1. Group Chat
    create group chat,invite member, delete group, quit group,
    message, accept/reject invitation
2. Individual Chat
    message, start private chat

*/

import React, { useEffect, useState, useRef} from "react";
import {useParams} from 'react-router-dom';
import "./Chat.css" 
import Messages from "./message/Messages";
import Searchbar from "./Searchbar";
import Pusher from 'pusher-js';
import {Buffer} from 'buffer';

function Chat() {

    const userId = useParams().userId;
    // id is userId of the initial message shown. id ==0 when it is clicked from home page
    const id = useParams().id;  
    const [currentChatId, setCurrentChatId] = useState("");
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [didMount, setDidMount] = useState(false);
    const pusher = useRef(null);

    const handleClick = (new_chat_id) => {
        setCurrentChatId(new_chat_id);
    }

    // Obtaining messages
    const getMessages = async (chat_id) => {
        await fetch("http://localhost:8080/private/displayMessage", {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({chatObjectId: chat_id})
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data);
            setParticipants(data.user);
            setMessages(data.chatHistory);
        })
    }

    //Obtaining chats
    const initialChats = async (user_id) => {
        await fetch(`http://localhost:8080/private/${user_id}/viewAllChat`)
        .then(res => {
            return res.json();
        })
        .then(chats => {
            console.log(chats);
            if (chats.length != 0) 
                setChats(chats);
            return chats;
        })
        .then(chats =>{
            if (chats.length != 0) {
                //it handles case that click from home page 
                if(id==0){
                    setCurrentChatId(chats[0]._id);
                    return chats[0]._id;
                }else{
                    // it handle case that click from profile 
                    let chat_id= chats[0]._id
                    let hvChat = false 
                    let findchatId = chats.map(chat=>{
                        if(chat.user[0].userId == id||chat.user[1].userId== id){
                            hvChat = true
                            chat_id = chat._id
                        }
                    })
                    console.log(hvChat)
                    if(hvChat==false){
                        console.log("no existing chat. Now creating a new one ")
                        createChat(id)
                    }
                    setCurrentChatId(chat_id)
                    return chat_id;
                }
                
            } else return chats
        })
        .then(chat_id => {
            console.log(currentChatId);
            if (!Array.isArray(chat_id)) {
                console.log(chat_id);
                getMessages(chat_id);
            }
        })
    }
    //Obtaining chats
    const getChats = async (user_id) => {
        await fetch(`http://localhost:8080/private/${user_id}/viewAllChat`)
        .then(res => {
            return res.json();
        })
        .then(chats => {
            console.log(chats);
            if (chats.length != 0) 
                setChats(chats);
            return chats;
        })
        .then(chats => {
            if (chats.length != 0) {
                setCurrentChatId(chats[0]._id);
                return chats[0]._id;
            } else return chats
        })
        .then(chat_id => {
            console.log(currentChatId);
            if (!Array.isArray(chat_id)) {
                console.log(chat_id);
                getMessages(chat_id);
            }
        })
    }
    //Quick create chats
    const createChat = async (user_id) => {
        fetch(`http://localhost:8080/private/createChat`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({user1: userId, user2: user_id})
        })
        .then(res => {
            if (!res.ok){
                res.json().then(data=>{
                    window.alert(data.msg)
                })
            }else{
                res.json().then(data=>{
                    console.log(`new room created id:${data._id}`)
                    setCurrentChatId(data._id)
                })
            }
        })
    }
    //componentDidMount
    useEffect(() => {
        pusher.current = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        setDidMount(true);
        console.log("update")
        initialChats(userId);
    }, []);

    // useEffect for changing between chats
    useEffect(() => {
        if (didMount){
            getMessages(currentChatId);
        }
    }, [currentChatId])

    // Pusher for updating messages
    useEffect(() => {
        const channel = pusher.current.subscribe('messages');
        channel.bind('insertedMessages', (newMessage) => {
            setMessages([...messages, newMessage]);
            getChats(userId);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [messages]);

    //Pusher for adding new chat
    useEffect(() => {
        const channel = pusher.current.subscribe('chats');
        channel.bind('insertedChats', (newChat) => {
            setChats(() => {
                const unsorted = [...chats, newChat];
                unsorted.sort((a, b) => {
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                })
                return unsorted;
            })
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [chats]);

    return(
        <div className="chat">
            <div className="chat-body">
                <div className="sidebar">
                    <div className="chats">
                        <Searchbar placeholder="Search to start new chat" user_id={userId} className="chats"/>
                        {chats.map((chat) => (
                            <div className="sidebarChat" onClick={() => handleClick(chat._id)} key={chat._id}>
                                
                                <img alt="" 
                                    height="80" 
                                    width="80" 
                                    src={(chat.user[0].userId == userId) 
                                        ? chat.user[1].photo?(chat.user[1].photo.data.length==0? "/img/blankProfilePic.png": Buffer.from(chat.user[1]?.photo,"base64").toString("ascii")):"/img/blankProfilePic.png"
                                        : chat.user[0].photo?(chat.user[0].photo.data.length==0? "/img/blankProfilePic.png": Buffer.from(chat.user[0]?.photo,"base64").toString("ascii")):"/img/blankProfilePic.png"
                                        }
                                />
                                <div className="sidebarChat-info">
                                    {(chat.user[0].userId == userId) ? <h2>{chat.user[1].username && chat.user[1].username}</h2> : <h2>{chat.user[0].username && chat.user[0].username}</h2>}
                                    {chat.chatHistory[chat.chatHistory.length-1] ? <p>{chat.chatHistory[chat.chatHistory.length-1].username}: {chat.chatHistory[chat.chatHistory.length-1].text}</p> : <p>&nbsp;</p>}
                                </div>  
                            </div>
                        ))}
                    </div>
                </div>
                <Messages key={currentChatId} messages={messages} user_id={userId} chat_id={currentChatId} participants={participants}/>
            </div>
        </div>
    );
};
export default Chat;