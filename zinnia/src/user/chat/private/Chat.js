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

    //componentDidMount
    useEffect(() => {
        pusher.current = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        setDidMount(true);
        getChats(userId);
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
                                {console.log(userId)}
                                <img alt="" height="80" width="80" src={(chat.user[0].userId == userId) ? (chat.user[1].photo && Buffer.from(chat.user[1]?.photo,"base64").toString("ascii")) : (chat.user[0].photo && Buffer.from(chat.user[0]?.photo,"base64").toString("ascii"))}/>
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