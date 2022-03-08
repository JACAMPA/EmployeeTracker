INSERT INTO department (name)
VALUES 
    ("engineering"),
    ("finance"),
    ("marketing"),
    ("sales");

SELECT * FROM DEPARTMENT;

INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer", 120000, 1),
    ("Project supervisor", 90000, 1),
    ("Engineering Manager", 225000, 1),
    ("Accountant", 70000, 2),
    ("Accounting CFO", 120000, 2),
    ("Marketing Manager", 50000, 3),
    ("Marketing Lead", 150000, 3),
    ("Sales Rep", 85000, 4);

SELECT * FROM roles;

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Monkey", "D Luffy", 3, NULL),
    ("Sheldon", "Cooper", 5, NULL),
    ("Howard", "Wolowitz", 6, NULL),
    ("Barney", "Stinson", 1, 1),
    ("Darth", "Revan", 4, 2),
    ("Michael", "Scott", 7, 3);

SELECT * FROM employee;