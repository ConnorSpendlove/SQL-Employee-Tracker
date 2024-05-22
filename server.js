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

function addDepartment() {
    inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter a department name:",
      },
    ])
    .then((answer) => {
      const query = `
        INSERT INTO department (department_name)
        VALUES (?);`;
      db.query(query, [answer.departmentName], (err, results) => {
        if (err) throw err;
        viewAllDepartments();
      });
    });
  }

  // Add a role
function addRole() {
    db.query("SELECT * FROM department;", (err, results) => {
      if (err) throw err;
      inquirer.prompt([
        {
          type: "input",
          name: "roleName",
          message: "Enter a role to be added:",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Enter the salary for the role:",
        },
        {
          type: "list",
          name: "departmentName",
          message: "Select department for this role:",
          choices: results.map(department => department.department_name),
        },
      ])
      .then((answer) => {
        const department = results.find(dept => dept.department_name === answer.departmentName);
        const query = `
          INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?);`;
        db.query(query, [answer.roleName, answer.roleSalary, department.department_id], (err, results) => {
          if (err) throw err;
          viewAllRoles();
        });
      });
    });
  }

  function addEmployee() {
    db.query("SELECT role_id, title FROM role;", (err, roleResults) => {
      if (err) throw err;
      const roles = roleResults.map(role => ({ name: role.title, value: role.role_id }));
  
      db.query("SELECT employee_id, CONCAT(first_name, ' ', last_name) as EmployeeName FROM employee;", (err, employeeResults) => {
        if (err) throw err;
        const managers = employeeResults.map(manager => ({ name: manager.EmployeeName, value: manager.employee_id }));
  
        inquirer.prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter employee first name to be added:",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter employee last name to be added:",
          },
          {
            type: "list",
            name: "roleId",
            message: "Choose a role:",
            choices: roles,
          },
          {
            type: "list",
            name: "managerId",
            message: "Choose a manager:",
            choices: managers,
          },
        ])
        .then((answer) => {
          const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?);`;
          db.query(query, [answer.firstName, answer.lastName, answer.roleId, answer.managerId], (err, results) => {
            if (err) throw err;
            viewAllEmployees();
          });
        });
      });
    });
  }

function updateEmployeeRole() {
    db.query(`
      SELECT employee_id, CONCAT(first_name, ' ', last_name) as EmployeeName, role.title
      FROM employee
      LEFT JOIN role ON employee.role_id = role.role_id;`, (err, employeeResults) => {
      if (err) throw err;
      db.query("SELECT role_id, title FROM role;", (err, roleResults) => {
        if (err) throw err;
        inquirer.prompt([
          {
            type: "list",
            name: "employeeName",
            message: "Select an employee to update:",
            choices: employeeResults.map(employee => employee.EmployeeName),
          },
          {
            type: "list",
            name: "roleTitle",
            message: "Select the new role you want to assign to the employee:",
            choices: roleResults.map(role => role.title),
          },
        ])
        .then((answer) => {
          const employee = employeeResults.find(emp => emp.EmployeeName === answer.employeeName);
          const role = roleResults.find(role => role.title === answer.roleTitle);
          const query = `
            UPDATE employee SET role_id = ?
            WHERE employee_id = ?;`;
          db.query(query, [role.role_id, employee.employee_id], (err, results) => {
            if (err) throw err;
            viewAllEmployees();
          });
        });
      });
    });
  }

  function quit() {
    db.end();
    console.info("Bye");
  }
  

  init();
