import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, Stack, DialogActions, TextField } from '@mui/material';

function AddTask({ fetchTasks }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [file_upload, setFile_upload] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("status", status);
        if (file_upload) {
          formData.append("file_upload", file_upload);
        }
    
        axios.post("http://localhost:8080/api/v1/taskmanagement/createTask", formData)
            .then((response) => {
                console.log(response);
                fetchTasks(); // Fetch tasks after adding a new one
                handleClose();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Button 
                color="primary" 
                variant="contained" 
                onClick={handleClickOpen} 
                style={{ position: 'fixed', top: '90px', left: '90%' }}>
                Add Task
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField 
                            variant="outlined" 
                            label="Title" 
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField 
                            variant="outlined" 
                            label="Description" 
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField 
                            variant="outlined" 
                            label="Status" 
                            onChange={(e) => setStatus(e.target.value)}
                        />
                        <input 
                            type="file" 
                            onChange={(e) => setFile_upload(e.target.files[0])} 
                        />
                        <Button 
                            color="primary" 
                            variant="contained" 
                            onClick={handleClick}>
                            Add Task
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddTask;