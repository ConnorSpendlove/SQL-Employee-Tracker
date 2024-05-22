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
);