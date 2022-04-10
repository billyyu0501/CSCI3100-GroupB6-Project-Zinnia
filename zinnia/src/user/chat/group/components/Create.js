import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Create({user_id}) {

    const [open, setOpen] = useState(false);
    const userId = user_id;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        setOpen(false);
        create();
    }

    const create = async () => {
        fetch(`http://localhost:8080/group/createGroup`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({hostId:userId})
        })
    }

    const theme = createTheme({
        palette: {
            primary: '#fffff',
        },
    });

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Button variant="contained" onClick={() => handleOpen()}>
                    Create new group
                </Button>
            </ThemeProvider>
            <Dialog open={open} onClose={() => handleClose()}>
                <DialogTitle>Create new group</DialogTitle>
                <DialogContent>
                    <TextField required autoFocus margin="dense" id="groupname" label="Group Name" type="text" fullWidth variant="outlined"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Cancel</Button>
                    <Button onClick={() => handleCreate()}>Create</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Create;