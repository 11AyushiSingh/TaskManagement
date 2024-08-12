import { useState, useEffect } from 'react';
import './task.css';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, Stack, DialogActions, TextField } from "@mui/material";

function Task({ id, title, description, status, fileUpload, deleteTask, fetchTasks }) {
  const [open, setOpen] = useState(false);
  const [editableTask, setEditableTask] = useState({ title, description, status });
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    setEditableTask({ title, description, status });
  }, [title, description, status]);
  
  useEffect(() => {
    if (fileUpload) {
      const url = `http://localhost:8080${fileUpload}`;
      setImageSrc(url);
    } else {
      setImageSrc(require('../assets/image1.PNG'));
    }
  }, [fileUpload]);
  
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editableTask.title);
      formData.append("description", editableTask.description);
      formData.append("status", editableTask.status);
      if (file) formData.append("file_upload", file);
  
      const response = await axios.put(`http://localhost:8080/api/v1/taskmanagement/updatetask/${id}`, formData);
      console.log(response.data);
      await fetchTasks(); // Fetch tasks after update
      handleClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/taskmanagement/deletetask/${id}`);
      console.log(response.data);
      await deleteTask(id); 
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  return (
    <>
      <div className="grid-container">
        <div className="box">
          <div className="Pic">
            <img src={imageSrc} alt="Task" />
          </div>
          <div className='title'>Title: {title}</div>
          <div className='description'>Description: {description}</div>
          <div className='status'>Status: {status}</div>
          <Button className='delete' onClick={handleDelete}>DELETE</Button>
          <Button className='update' color="primary" variant="contained" onClick={handleClickOpen}>UPDATE</Button>
          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Update Task</DialogTitle>
            <DialogContent>
              <Stack spacing={2} margin={2}>
                <TextField
                  variant="outlined"
                  label="Title"
                  name="title"
                  value={editableTask.title}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  label="Description"
                  name="description"
                  value={editableTask.description}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  label="Status"
                  name="status"
                  value={editableTask.status}
                  onChange={handleChange}
                />
                <input
                  type="file"
                  accept=".jpg,.png,.pdf,"
                  onChange={handleFileChange}
                />
                <Button color="primary" variant="contained" onClick={handleUpdate}>Update</Button>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default Task;