import React, { useEffect, useState, useRef} from "react";
import {useParams} from 'react-router-dom';
import Pusher from 'pusher-js';
import Create from "./components/Create";

function Groupchat() {

    const userId = useParams();
    const [currentRoomId, setCurrentRoomId] = useState("");
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [didMount, setDidMount] = useState(false);
    const [roomname, setRoomname] = useState("");
    const pusher = useRef(null);

    const handleClick = (new_room_id) => {
        setCurrentRoomId(new_room_id);
    }

    // Obtaining messages
    const getMessages = async (room_id) => {
        await fetch("http://localhost:8080/group/displayMessage", {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({roomObjectId: room_id})
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            setRoomname(data.room);
            setMessages(data.chatHistory);
        })
    }

    //Obtaining rooms
    const getRooms = async () => {
        await fetch(`http://localhost:8080/group/${userId}/viewAllGroup`)
        .then(res => {
            return res.json();
        })
        .then(rooms => {
            setRooms(rooms);
            return rooms;
        })
        .then(rooms => {
            setCurrentRoomId(rooms[0]._id);
            return rooms[0]._id;
        })
        .then(room_id => {
            getMessages(room_id);
        })
    }

    //componentDidMount
    useEffect(() => {
        pusher.current = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        setDidMount(true);
        getRooms(userId);
    }, []);

    // changing between rooms
    useEffect(() => {
        if (didMount){
            getMessages(currentRoomId);
        }
    }, [currentRoomId])

    // Pusher for updating messages
    useEffect(() => {
        const channel = pusher.current.subscribe('groupMessages');
        channel.bind('insertedGroupMessages', (newMessage) => {
            setMessages([...messages, newMessage]);
            getRooms(userId);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [messages]);

    //Pusher for adding new room
    useEffect(() => {
        const channel = pusher.current.subscribe('rooms');
        channel.bind('insertedRooms', (newRoom) => {
            setRooms(() => {
                const unsorted = [...rooms, newRoom];
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
    }, [rooms]);


    return (
        <div className="chat">
            <div className="chat-body">
                <div className="sidebar">
                    <div className="chats">
                        <Create user_id={userId}/>
                        <Invitations user_id={userId}/>
                        {rooms.map((room) => (
                            <div className="sidebarChat" onClick={() => handleClick(room._id)} key={room._id}>
                                <div className="sidebarChat-info">
                                    {room.room && <h2>{room.room}</h2>}
                                    {room.chatHistory[room.chatHistory.length-1] ? <p>{room.chatHistory[room.chatHistory.length-1].username}: {room.chatHistory[room.chatHistory.length-1].text}</p> : <p>&nbsp;</p>}
                                </div>  
                            </div>
                        ))}
                    </div>
                </div>
                <Groupmessages key={currentRoomId} messages={messages} user_id={userId} room_id={currentRoomId} roomname={roomname}/>
            </div>
        </div>
    )
}

export default Groupchat;