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
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Invite({user_id, room_id, roomname}) {
    // button and pop-up dialog component for inviting other users to the group chat
    // pop-up dialog show list of friends to invite

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

    // obtain list of friends to display in pop-up dialog
    const fetchFriendlist = async () => {
        fetch(`http://localhost:8080/group/friendlist`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({userId: userId})
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            if(data.length != 0)
                setFriends(data.friend);
        })
    }

    useEffect(() => {
        fetchFriendlist();
    },[])

    const theme = createTheme({
        palette: {
            primary: {
                main: '#ffffff',
            }
        },
    });

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Button variant="contained" onClick={() => handleOpen()}>
                    Invite
                </Button>
            </ThemeProvider>
            <Dialog onClose={() => handleClose()} open={open}>
                <DialogTitle sx={{backgroundColor: '#40424f', color: '#ffffff'}}>Click to invite to {roomname && roomname}</DialogTitle>
                <List dense={true} sx={{backgroundColor: '#40424f', color: '#ffffff'}}>
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