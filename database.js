const mysql=require('mysql2');
module.exports=mysql.createConnection({
    host:'localhost',
    user:'root',    // your mysql username
    password:'Radhe@123',    // your mysql password
    database:'ccms-schema'   // your mysql database name
});