const mysql = require("mysql2");
// Connect to database
const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      database: "employee_db",
      password: 'Password123321',
    },
    console.info("Connected to the employee_db database."),
    
  );

 module.exports = db;