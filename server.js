// Imports
const mysql = require("mysql2");
const db = require("./db/connection.js");

// Function that starts the application
async function init() {
  const inquirer = await import('inquirer');
  const mainMenu = await inquirer.default.prompt([
    {
      type: "list",
      name: "choices",
      message: "Please, choose an option:",
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

// View all departments
function viewAllDepartments() {
  const query = `
    SELECT id as "Department ID",
           name as "Department Name"
    FROM department;`;
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
}

// View all roles
function viewAllRoles() {
  const query = `
    SELECT role.id as "Role ID",
           role.title as "Role Title",
           role.salary as "Role Salary",
           department.name as "Department Name"
    FROM role
    LEFT JOIN department ON role.department_id = department.id;`;
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
}

// View all employees
function viewAllEmployees() {
  const query = `
    SELECT employee.id as "Employee ID",
           CONCAT(employee.first_name, " ", employee.last_name) as "Employee Name",
           CONCAT(IFNULL(manager.first_name, "NO MANAGER ASSIGNED"), " ", IFNULL(manager.last_name, "")) as "Manager",
           role.title as "Role",
           department.name as "Department",
           role.salary as "Salary"
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
}

// Add a department
async function addDepartment() {
  const inquirer = await import('inquirer');
  const answer = await inquirer.default.prompt([
    {
      type: "input",
      name: "departmentName",
      message: "Enter a department name:",
    },
  ]);
  const query = `
    INSERT INTO department (name)
    VALUES (?);`;
  db.query(query, [answer.departmentName], (err, results) => {
    if (err) throw err;
    viewAllDepartments();
  });
}

// Add a role
async function addRole() {
  const inquirer = await import('inquirer');
  db.query("SELECT * FROM department;", async (err, results) => {
    if (err) throw err;
    const answer = await inquirer.default.prompt([
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
        choices: results.map(department => department.name),
      },
    ]);
    const department = results.find(dept => dept.name === answer.departmentName);
    const query = `
      INSERT INTO role (title, salary, department_id)
      VALUES (?, ?, ?);`;
    db.query(query, [answer.roleName, answer.roleSalary, department.id], (err, results) => {
      if (err) throw err;
      viewAllRoles();
    });
  });
}

// Add an employee
async function addEmployee() {
  const inquirer = await import('inquirer');
  db.query("SELECT id, title FROM role;", (err, roleResults) => {
    if (err) throw err;
    const roles = roleResults.map(role => ({ name: role.title, value: role.id }));

    db.query("SELECT id, CONCAT(first_name, ' ', last_name) as EmployeeName FROM employee;", async (err, employeeResults) => {
      if (err) throw err;
      const managers = employeeResults.map(manager => ({ name: manager.EmployeeName, value: manager.id }));

      const answer = await inquirer.default.prompt([
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
      ]);
      const query = `
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?);`;
      db.query(query, [answer.firstName, answer.lastName, answer.roleId, answer.managerId], (err, results) => {
        if (err) throw err;
        viewAllEmployees();
      });
    });
  });
}

// Update employee role
async function updateEmployeeRole() {
  const inquirer = await import('inquirer');
  db.query(`
    SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as EmployeeName, role.title
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id;`, (err, employeeResults) => {
    if (err) throw err;
    db.query("SELECT id, title FROM role;", async (err, roleResults) => {
      if (err) throw err;
      const answer = await inquirer.default.prompt([
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
      ]);
      const employee = employeeResults.find(emp => emp.EmployeeName === answer.employeeName);
      const role = roleResults.find(role => role.title === answer.roleTitle);
      const query = `
        UPDATE employee SET role_id = ?
        WHERE id = ?;`;
      db.query(query, [role.id, employee.id], (err, results) => {
        if (err) throw err;
        viewAllEmployees();
      });
    });
  });
}

// End process
function quit() {
  db.end();
  console.info("Bye");
}

// Call Init function
init();
