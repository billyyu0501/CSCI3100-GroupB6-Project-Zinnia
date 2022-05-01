import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Leave({user_id, room_id, roomname}) {
    // button and pop-up dialog component for leaving group chat

    const userId = user_id;
    const roomId = room_id;
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLeave = () => {
        setOpen(false);
        leave(userId);
    }

    const leave = async () => {
        fetch(`http://localhost:8080/group/quitGroup`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({userId: userId, roomObjectId: roomId})
        })
        .then(res => {
            if (!res.ok)
                return res.json();
            return null;
        })
        .then(data => {
            if (data)
                alert(data.msg);
            else
                window.location.reload();
        })
    }

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
                    Leave group
                </Button>
            </ThemeProvider>
            <Dialog open={open} onClose={() => handleClose()}>
                <DialogTitle sx={{backgroundColor: '#40424f', color: '#ffffff'}}>Leave {roomname && roomname}?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Cancel</Button>
                    <Button onClick={() => handleLeave()}>Okay</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Leave;