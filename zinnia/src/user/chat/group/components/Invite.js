import React, {useState, useEffect} from 'react';
import {Buffer} from 'buffer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { createTheme, ThemeProvider } from '@emotion/react';

const emails = ['username@gmail.com', 'user02@gmail.com'];

function Invite({user_id, room_id, roomname}) {

    const userId = user_id;
    const roomId = room_id;
    const [open, setOpen] = useState(false);
    const [friends, setFriends] = useState([]);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleInvite = (user_id) => {
        setOpen(false);
        invite(user_id);
    };

    const invite = async (user_id) => {
        fetch(`http://localhost:8080/group/inviteMember`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({invitedUser:user_id, roomObjectId:roomId})
        })
        .then(res => {
            if (!res.ok)
                return res.json();
            return null;
        })
        .then(data => {
            if (data)
                alert(data.msg);
            else setOpen(false);
        })
    }

    const fetchFriendlist = async () => {
        fetch(`http://localhost:8080/group/friendlist`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({userId: userId})
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data);
            if(data.length != 0)
                setFriends(data.friend);
        })
    }

    const theme = createTheme({
        palette: {
            primary: '#fffff',
        },
    });

    useEffect(() => {
        fetchFriendlist();
    },[])

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Button varient="contained" onClick={() => handleOpen()}>
                    Invite
                </Button>
            </ThemeProvider>
            <Dialog onClose={() => handleClose()} open={open}>
                <DialogTitle>Click to invite to {roomname && roomname}</DialogTitle>
                <List dense={dense}>
                    {friends.map((friend) => (
                        <ListItem button onClick={() => handleInvite(friend.userId)} key={friend.userId}>
                            <ListItemAvatar>
                                <Avatar alt={friend.username && friend.username} src={friend.photo && Buffer.from(friend.photo,"base64").toString("ascii")} sx={{ width: 40, height: 40 }}/>
                            </ListItemAvatar>
                            <ListItemText primary={friend.username && friend.username}/>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </React.Fragment>
    );
}

export default Invite;