
const upload = require('../config/multerConfig'); 
const db = require("../config/db");
const xlsx = require('xlsx'); 


const getTaskManagementList = async(req, res) => {
  try{

    const data = await db.query('SELECT * FROM task')
    if(!data){
        return res.status(404).send({
            success: false,
            message: 'Task not found'
        })

    }
    res.status(200).send({
        success: true,
        message: 'All task list',
        data: data[0]
    })

  }catch(error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: 'Error in get task management list',
        error
    })
  }
}

const getTaskManagementById = async(req, res) => {
    try{
  
      const taskById = req.params.id
      if(!taskById){
          return res.status(404).send({
              success: false,
              message: 'Invalid ID'
          })
  
      }
      const data = await db.query(`SELECT * FROM task WHERE id = ?`,[taskById])
      if(!data){
        return res.status(404).send({
            success: false,
            message: 'Task not found'
        })
      }
      res.status(200).send({
          success: true,
          message: 'All task list',
          data: data[0]
      })
  
    }catch(error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: 'Error in get task management list',
          error
      })
    }
  }

  const createTask = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: 'Error in file upload',
          error: err.message
        });
      }
  
      try {
        if (!req.file) {
          return res.status(400).send({
            success: false,
            message: 'Please upload an Excel file'
          });
        }
  
        // Determine the file path
        const filePath = req.file.path;
  
        // Read the Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const tasks = xlsx.utils.sheet_to_json(sheet);
  
        // Insert each task into the database
        for (let task of tasks) {
          const { title, description, status } = task;
  
          if (!title || !description || !status) {
            return res.status(400).send({
              success: false,
              message: 'Missing fields in the Excel file'
            });
          }
  
          await db.query(
            `INSERT INTO task (title, description, status) VALUES (?, ?, ?)`,
            [title, description, status]
          );
        }
  
        res.status(201).send({
          success: true,
          message: 'Tasks created successfully from Excel file'
        });
  
      } catch (error) {
        console.error(error);
        res.status(500).send({
          success: false,
          message: 'Error in creating tasks from Excel file',
          error: error.message
        });
      }
    });
  };


// Update Task with file upload
const updateTask = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({
        success: false,
        message: 'Error in file upload',
        error: err.message
      });
    }

    try {
      const taskId = req.params.id;
      if (!taskId) {
        return res.status(404).send({
          success: false,
          message: 'Invalid Id',
        });
      }

      const { title, description, status } = req.body;
      let fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

      // Check if the uploaded file is an Excel file
      if (fileUrl && req.file.mimetype.includes('spreadsheetml')) {
        // Read and parse the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const tasks = xlsx.utils.sheet_to_json(sheet);

        // Assuming the Excel contains only one row for the update
        if (tasks.length > 0) {
          const updatedTask = tasks[0];

          // Update task with data from the Excel file
          await db.query(
            `UPDATE task SET title = ?, description = ?, status = ? WHERE id = ?`,
            [updatedTask.title, updatedTask.description, updatedTask.status, taskId]
          );
        }
      } else {
        // Update task normally if no Excel file is uploaded
        const [result] = await db.query(
          `UPDATE task SET title = ?, description = ?, status = ?, file_upload = ? WHERE id = ?`,
          [title, description, status, fileUrl, taskId]
        );

        if (result.affectedRows === 0) {
          return res.status(404).send({
            success: false,
            message: 'Task not found or no changes made',
          });
        }
      }

      res.status(200).send({
        success: true,
        message: 'Task updated successfully',
      });

    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Task update failed',
        error: error.message
      });
    }
  });
};


const deleteTask = async(req, res) => {
   try{
    const taskId = req.params.id;
    if(!taskId) {
        return res.status(404).send({
            success: false,
            message: 'Invalid id'
        })
    }

    await db.query(`DELETE FROM task WHERE id = ?`, [taskId]);
    res.status(200).send({
        success: true,
        message: 'Task deleted successfully'
    })
   }catch(error){
    console.log(error);
    res.send({
        success: false,
        message: 'Error in task deletion',
        error
    })
   } 

}


module.exports = {
  getTaskManagementList,
  getTaskManagementById,
  createTask,
  updateTask,
  deleteTask
};
