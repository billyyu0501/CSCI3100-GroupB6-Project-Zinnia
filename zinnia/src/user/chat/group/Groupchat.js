import React, { useEffect, useState, useRef} from "react";
import Pusher from 'pusher-js';
import Create from "./components/Create";
import Invitations from "./components/Invitations";
import Groupmessage from "./message/Groupmessage";
import "./Groupchat.css"

function Groupchat({user_id}) {
    // Groupchat component includes sidebar on the left and Groupmessages component on the right
    // sidebar display all group chats a user is part of and contains Create and Invitations components

    const userId = user_id;
    const [currentRoomId, setCurrentRoomId] = useState("");
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [didMount, setDidMount] = useState(false);
    const [roomname, setRoomname] = useState("");
    const [rerender, setRerender] = useState(0); // setRerender to be passed to child components for rerendering Groupchat

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

    useEffect(() => {
        setDidMount(true);
        getRooms(userId);
    }, []);

    // useEffect for changing between rooms
    useEffect(() => {
        if (didMount){
            getMessages(currentRoomId);
        }
    }, [currentRoomId])

    // update list of group chats on rerender
    useEffect(() => {
        getRooms(userId);
    }, [rerender])

    // Pusher for updating messages
    useEffect(() => {
        const pusher = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        const channel = pusher.subscribe('privateGroupMessages');
        channel.bind('insertedGroupMessages', (newMessage) => {
            setMessages([...messages, newMessage]);
            getRooms(userId);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        }
    }, [messages]);

    //Pusher for adding new room
    useEffect(() => {
        const pusher = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        const channel = pusher.subscribe('privateRooms');
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
            pusher.disconnect();
        }
    }, [rooms]);

    return (    
        <div className="chat">
            <div className="chat-body">
                <div className="sidebar">
                <Create user_id={userId} rerender={setRerender}/>
                <Invitations user_id={userId} rerender={setRerender}/>
                    <div className="chats">
                        {rooms.map((room) => (
                            <div className="sidebarChat" onClick={() => handleClick(room._id)} key={room._id}>
                                <div className="sidebarChat-info">
                                    {room.room && <h2>{room.room}</h2>}
                                    {room.chatHistory[room.chatHistory.length-1] ? <p>{room.chatHistory[room.chatHistory.length-1].username}: {room.chatHistory[room.chatHistory.length-1].text}</p> : <p><br></br></p>}
                                </div>  
                            </div>
                        ))}
                    </div>
                </div>
                <Groupmessage key={currentRoomId} messages={messages} user_id={userId} room_id={currentRoomId} roomname={roomname} rerender={setRerender}/>
            </div>
        </div>
    )
}

export default Groupchat;