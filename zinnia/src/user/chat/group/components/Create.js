import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Create({user_id, rerender}) {

    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const userId = user_id;

    const handleInput = (e) => {
        setInput(e.target.value);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        if (input == "")
            alert("The room name must not be empty");
        else {
            handleClose();
            create();
            rerender(Math.random());
            window.location.reload();
        }
    };

    const create = async () => {
        fetch(`http://localhost:8080/group/createGroup`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({hostId:userId, room:input})
        })
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#ffffff',
            }
        },
        components: {
            // Name of the component
            MuiButton: {
                styleOverrides: {
                    // Name of the slot
                    root: {
                        // Some CSS
                        backgroundColor: '#ffffff',
                    }
                }
            }
        }
    })

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Button variant="contained" onClick={() => handleOpen()}>
                    Create new group
                </Button>
            </ThemeProvider>
            <Dialog open={open} onClose={() => handleClose()}>
                <DialogTitle sx={{backgroundColor: '#40424f', color: '#ffffff'}}>Create new group</DialogTitle>
                <DialogContent>
                    <TextField value={input} onChange={handleInput} InputLabelProps={{ shrink: true }} required autoFocus id="groupname" type="text" fullWidth variant="outlined"/>
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