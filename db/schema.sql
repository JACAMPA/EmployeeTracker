DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(20,2) NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON UPDATE CASCADE
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INT NOT NULL,
    manager_id INT NULL,
    FOREIGN KEY (roles_id)
        REFERENCES roles(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON UPDATE CASCADE
);