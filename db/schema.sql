DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    department_id INT NOT NULL PRIMARY KEY,
    department_name  VARCHAR(30) NOT NULL
);

CREATE TABLE employee (
);

CREATE TABLE role (
    role_id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id ) 
    REFERENCES department(department_id)  
    ON DELETE SET NULL
);