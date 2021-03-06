import React, {useEffect, useState, useRef} from "react";
import {useParams} from 'react-router-dom';
import "./Chat.css" ;
import Messages from "./message/Messages";
import Searchbar from "./Searchbar";
import Pusher from 'pusher-js';
import {Buffer} from 'buffer';
function Chat({user_id}) {
    // Chat(private) component includes sidebar on the left and Messages component on the right
    // sidebar display all private chats a user has and contains Searchbar component

    const userId = user_id;
    // id is userId of the initial message shown. id == 0 when it is clicked from home page
    const id = useParams().id;
    const [currentChatId, setCurrentChatId] = useState("");
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [didMount, setDidMount] = useState(false);

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
            //console.log(chats);
            if (chats.length != 0) 
                setChats(chats);
            return chats;
        })
        .then(async chats =>{    
            //it handles case that click from home page 
            if(id==0){
                if(chats.length!=0){
                    setCurrentChatId(chats[0]._id)
                    return chats[0]._id;
                }
                return chats
            }else{
                // it handle case that click from profile 
                let chat_id
                let hvChat = false 
                let findchatId = chats.map(chat=>{
                    console.log(chat)
                    if(chat.user[0].userId == id||chat.user[1].userId== id){
                        hvChat = true
                        setCurrentChatId(chat._id)
                        chat_id = chat._id
                    }
                })
                if(hvChat==false){
                    console.log("no existing chat. Now creating a new one ")
                    await createChat(id)
                    }
                return chat_id;
            }
        })
        .then(chat_id => {
            if (!Array.isArray(chat_id)) {
                console.log(chat_id);
                //console.log("rendering message")
            }else{
                //console.log("no message")
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

    useEffect(() => {
        setDidMount(true);
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
        const pusher = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        const channel = pusher.subscribe('privateMessages');
        channel.bind('insertedMessages', (newMessage) => {
            setMessages([...messages, newMessage]);
            getChats(userId);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        }
    }, [messages]);

    //Pusher for adding new chat
    useEffect(() => {
        const pusher = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        const channel = pusher.subscribe('privateChats');
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
            pusher.disconnect();
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