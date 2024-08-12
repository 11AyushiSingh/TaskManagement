const mysql = require('mysql2/promise');
// const { Connection } = require('mysql2/typings/mysql/lib/Connection');
const mysqlConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mysql@123',
    database: 'task_management'
})
//  mysqlConnection.connect((err)=>{
//     if(err){
//         console.log('error in db connection: '+JSON.stringify(err,undefined,2));
//     }else{
//            console.log('db connected successfully');
//     }
// })
module.exports = mysqlConnection