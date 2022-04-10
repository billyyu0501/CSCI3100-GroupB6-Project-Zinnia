import React, {useState, useEffect, useRef} from 'react';
import Pusher from 'pusher-js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@emotion/react';

function Invitations({user_id}) {

    const userId = user_id;
    const [open, setOpen] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const pusher = useRef(null);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const fetchInvitations = async () => {
        fetch(`http://localhost:8080/${user_id}/gpInvitation`)
        .then(res => {
            return res.json();
        })
        .then(data => {
            setInvitations(data.gpInvitation);
        })
    }

    const theme = createTheme({
        palette: {
            primary: '#fffff',
        },
    });

    useEffect(() => {
        pusher.current = new Pusher('9bfa9c67db40709d3f03', {cluster: 'ap1'});
        fetchInvitations();
    },[])

    //Pusher for adding new invitation
    useEffect(() => {
        const channel = pusher.current.subscribe('invitations');
        channel.bind('insertedInvitations', (newInvitation) => {
            setInvitations(() => {
                const unsorted = [...invitations, newInvitation];
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
    }, [invitations]);

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Button varient="contained" onClick={() => handleOpen()}>
                    Invitations
                </Button>
            </ThemeProvider>
            <Dialog onClose={() => handleClose()} open={open}>
                <DialogTitle>Group Invitations</DialogTitle>
                <List dense={dense}>
                    {invitations.map((invitation) => {
                        <ListItem secondaryAction={
                            <IconButton edge="end">
                                <DeleteIcon />
                            </IconButton>
                        }>
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Single-line item"/>
                        </ListItem>
                    })}
                </List>
            </Dialog>
        </React.Fragment>
    );
}

export default Invitations;