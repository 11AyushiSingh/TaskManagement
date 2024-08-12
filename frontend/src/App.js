import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AddTask from './components/AddTask/addTask';
import TaskList from './components/taskList';

function App() {
  const [tasks, setTasks] = useState([]);

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/taskmanagement/list');
      const tasksData = response.data.data;
      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/taskmanagement/${id}`);
      // Remove the task from the state after deletion
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  

  return (
    <>
      <div>
        <AddTask fetchTasks={fetchTasks} />
      </div>
      <div className="grid-container">
        <TaskList tasks={tasks} deleteTask={deleteTask} fetchTasks={fetchTasks} />
        
      </div>
    </>
  );
}

export default App;