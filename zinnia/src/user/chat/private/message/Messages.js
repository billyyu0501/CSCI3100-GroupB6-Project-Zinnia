import React, { useState, useEffect, useRef } from 'react';
import {DateTime} from 'luxon';
import {Buffer} from 'buffer';
import "./Messages.css";

function Messages({messages, user_id, chat_id, participants}){

    const userId = user_id;
    const chatId = chat_id;
    const user0 = participants[0]?.username;
    const user1 = participants[1]?.username;
    const [input, setInput] = useState("");
    const ref = useRef(null);
    // Send messages
    const sendMessage = async (e) => {
        if (chatId !== "") {
            e.preventDefault();
            await fetch("http://localhost:8080/private/sendMessage", {
                method: 'POST', headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({userId: userId, chatObjectId: chatId, text: input}), mode: 'cors',
            });
        }
        setInput("");
    }

    const scrollToBottom = () => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }

    useEffect(() => {
        scrollToBottom();
    },[messages])
    

    return (
        <div className="messages">
            <div className="messages-header">
                <img alt="" 
                    height="100" 
                    width="100" 
                    src={(userId == participants[0]?.userId) 
                        ? (participants[1] && (participants[1].photo.data.length==0? "/img/blankProfilePic.png": Buffer.from(participants[1]?.photo,"base64").toString("ascii"))) 
                        : (participants[0] && (participants[0].photo.data.length==0? "/img/blankProfilePic.png": Buffer.from(participants[0]?.photo,"base64").toString("ascii")))    
                        }
                />
                <div className="messages-headerInfo">
                    {(userId == participants[0]?.userId) ? <h2>{user1}</h2> : <h2>{user0}</h2>}
                </div>
            </div>
            <div className="messages-body" ref={ref}>
                {messages && messages.map((message) => (
                    <p className="message" key={message._id}>
                        <span className="message-name">
                            {message.speaker && message.speaker.username}
                        </span>
                            {message.text}
                        <span className="message-timestamp">
                            {DateTime.fromISO(message.time).toLocaleString(DateTime.DATETIME_MED)}
                        </span>
                    </p>
                ))} 
            </div>
            <div className="messages-footer">
                <form onSubmit={sendMessage}>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" type="text"/>
                    <button type="submit">Send message</button>
                </form>
            </div>
        </div>
    )
}

export default Messages;