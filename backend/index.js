const express = require('express');
const dotenv  = require('dotenv');
const path = require('path');
const mysqlPool = require('./config/db');
const cors = require("cors");
//configure dotenv
dotenv.config()


//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api/v1/taskmanagement', require('./routes/taskManagementRoutes'));

app.get('/test', (req, res) => {
  res.status(200).send("Server is running at port 8080");
})

//port
const PORT = process.env.PORT || 8000;

//conditionaly Listen
mysqlPool.query('SELECT 1').then(() => {
    console.log('MYSQL DB connected')
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
      })      

}).catch((error) => {
  console.log(error)
})

//listen
