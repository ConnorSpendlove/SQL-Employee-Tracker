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
  switch (mainMenu.choices) {
    case "View All Departments":
      viewAllDepartments();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "View All Employees":
      viewAllEmployees();
      break;
    case "Add a Department":
      addDepartment();
      break;
    case "Add a Role":
      addRole();
      break;
    case "Add an Employee":
      addEmployee();
      break;
    case "Update an Employee Role":
      updateEmployeeRole();
      break;
    case "Quit":
      quit();
      break;
  }
}

function viewAllDepartments() {
    const query = `
    SELECT department_id as "Department ID",
    department_name as "Department Name"
    FROM department;`;
    db.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    });
  }

  function viewAllRoles() {
    const query = `
    SELECT role_id as "Role ID",
    title as "Role Title",
    salary as "Role Salary",
    department_name as "Department Name"
    FROM role
    LEFT JOIN department ON role.department_id = department.department_id;`;
    db.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    });
  }

  // View all employees
function viewAllEmployees() {
    const query = `
    SELECT employee.employee_id as "Employee ID",
    CONCAT(employee.first_name, " ", employee.last_name) as "Employee Name",
    CONCAT(IFNULL(manager.first_name, "NO MANAGER ASSIGNED"), " ", IFNULL(manager.last_name, "")) as "Manager",
    role.title as "Role",
    department.department_name as "Department",
    role.salary as "Salary"
    FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id
    LEFT JOIN employee manager ON employee.manager_id = manager.employee_id;`;
    db.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    });
  }
