// Imports
const mysql = require("mysql2");
const inquirer = require("inquirer");
const db = require("./db/connection.js");

// Function that starts the application
async function init() {
  const mainMenu = await inquirer.prompt([
    {
      type: "list",
      name: "choices",
      message: "Select an option",
      choices: [
        { value: "View All Departments" },
        { value: "View All Roles" },
        { value: "View All Employees" },
        { value: "Add a Department" },
        { value: "Add a Role" },
        { value: "Add an Employee" },
        { value: "Update an Employee Role" },
        { value: "Quit" },
      ],
    },
  ]);
}