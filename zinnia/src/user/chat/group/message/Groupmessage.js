import React, { useState, useEffect, useRef } from 'react';
import {DateTime} from 'luxon';
import Invite from "../components/Invite";
import Leave from "../components/Leave";
import Delete from "../components/Delete";
import "./Groupmessage.css";

function Groupmessage ({messages, user_id, room_id, roomname, rerender}) {
    // display all messages in a group chat and sends messages
    // includes the Delete, Leave and Invite components

    const roomId = room_id;
    const userId = user_id;
    const [input, setInput] = useState("");
    const ref = useRef(null);

    // Send messages
    const sendMessage = async (e) => {
        if (roomId !== "") {
            e.preventDefault();
            await fetch("http://localhost:8080/group/sendMessage", {
                method: 'POST', headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({userId: userId, roomObjectId: roomId, text: input}), mode: 'cors',
            });
        }
        setInput("");
    }

    const scrollToBottom = () => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }

    // auto-scroll to bottom on new message
    useEffect(() => {
        scrollToBottom();
    },[messages])
    

    return (
        <div className="messages">
            <div className="messages-header">
                <div className="messages-headerInfo">
                    <h2>{roomname}</h2>
                    <Invite user_id={userId} room_id={roomId} roomname={roomname}/>
                    <Leave user_id={userId} room_id={roomId} roomname={roomname} rerender={rerender}/>
                    <Delete user_id={userId} room_id={roomId} roomname={roomname} rerender={rerender}/>
                </div>
            </div>
            <div className="messages-body" ref={ref}>
                {messages && messages.map((message) => (
                    <p className={message.speaker && ((message.speaker.userId == user_id) ? "message" : "message-received")} key={message._id}>
                        <span className="message-name">
                            {message.speaker && (message.speaker.userId != user_id && message.speaker.username)}
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

export default Groupmessage;