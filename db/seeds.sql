INSERT INTO department (department_name)
VALUES ("Research and Development"),
       ("Human Resources"),
       ("Marketing"),
       ("Customer Support");

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Support Representative", 50000, 4),
       ("Customer Support Manager", 75000, 4),
       ("R&D Director", 150000, 1),
       ("Research Scientist", 90000, 1),
       ("Marketing Director", 120000, 3),
       ("Marketing Specialist", 70000, 3),
       ("HR Coordinator", 60000, 2),
       ("HR Manager", 85000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Alice", "Johnson", 5, NULL),
        ("Bob", "Williams", 6, 1),
        ("Charlotte", "Miller", 6, 1),
        ("David", "Garcia", 8, 2),
        ("Emma", "Martinez", 7, 2),
        ("Frank", "Lee", 1, 3),
        ("Grace", "Davis", 2, 3);
