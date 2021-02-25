USE brianckwang_company;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS job_role;
DROP TABLE IF EXISTS department;

CREATE TABLE IF NOT EXISTS department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL, 
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary FLOAT NOT NULL,
  department_id INT NOT NULL, 
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE IF NOT EXISTS employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);


SELECT e.first_name, e.last_name employee, r.title, r.salary role FROM employee e INNER JOIN role r ON e.role_id = r.id;