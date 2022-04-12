import React, {useState, useEffect, useRef} from 'react';
import Pusher from 'pusher-js';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Invitations({user_id, rerender}) {

    const userId = user_id;
    const [open, setOpen] = useState(false);
    const [invitations, setInvitations] = useState([]);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleInvitation = async (status, roomId) => {
        fetch(`http://localhost:8080/group/acceptInvitation`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({userId: userId, roomObjectId: roomId, IsAccepted: status}), mode: 'cors',
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data);
            rerender(Math.random());
        })
    }

    const fetchInvitations = async () => {
        fetch(`http://localhost:8080/${userId}/gpInvitation`)
        .then(res => {
            return res.json();
        })
        .then(data => {
            setInvitations(data.gpInvitation);
        })
    }

    useEffect(() => {
        fetchInvitations();
    },[])

    useEffect(() => {
        fetchInvitations();
    }, [invitations]);

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
                    Invitations
                </Button>
            </ThemeProvider>
            <Dialog onClose={() => handleClose()} open={open}>
                <DialogTitle sx={{backgroundColor: '#40424f', color: '#ffffff'}}>Group Invitations</DialogTitle>
                {invitations.length == 0 && <Typography sx={{backgroundColor: '#40424f', color: '#ffffff', paddingLeft: '15px'}}>There are no invitations</Typography>}
                <List dense={true} sx={{backgroundColor: '#40424f', color: '#ffffff'}}>
                    {invitations.map((invitation) => {
                        return (<ListItem key={invitation.room._id}>
                            <ListItemText primary={invitation.room.room}/>
                            <ListItemIcon>
                                <IconButton onClick={() => handleInvitation(true, invitation.room._id)}>
                                    <Done />
                                </IconButton>
                            </ListItemIcon>
                            <ListItemIcon>
                                <IconButton onClick={() => handleInvitation(false, invitation.room._id)}>
                                    <Close/>
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>)
                    })} 
                </List>
            </Dialog>
        </React.Fragment>
    );
}

export default Invitations;