const mysql = require("mysql2");
// Connect to database
const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      database: "employee_db"
    },
    console.info(dash.repeat(20)),
    console.info("Connected to the employee_db database."),
    console.info(dash.repeat(20)),
  );

 module.exports = db;