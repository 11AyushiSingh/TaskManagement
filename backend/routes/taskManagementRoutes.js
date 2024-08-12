const express = require('express');
const { getTaskManagementList,getTaskManagementById, createTask, updateTask,deleteTask } = require('../controller/taskManagementController');

const router = express.Router()

//Read Task
router.get('/list',getTaskManagementList)
router.get('/task/:id', getTaskManagementById)

//Create Task

router.post('/createtask',createTask)

//Update Task
router.put('/updatetask/:id',updateTask)

//Delete Task
router.delete('/deletetask/:id',deleteTask)
module.exports = router