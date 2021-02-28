const db = require('./database');

const viewAllEmployees = function() {
  return db.promise().execute(`
      SELECT e.id AS "ID", 
            e.first_name AS "First_Name", 
            e.last_name AS "Last_Name", 
            r.title AS "Title", 
            d.name AS "Department", 
            r.salary "Salary", 
            CONCAT(m.first_name , " ", m.last_name) AS "Manager"
      FROM employee e
      LEFT JOIN employee m ON e.manager_id = m.id
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      ORDER BY id
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const viewAllDepartments = function() {
  return db.promise().execute(`
    SELECT *
    FROM department
    ORDER BY id
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const viewEmployeeByDepartment = function(department_id) {
  return db.promise().execute(`
    SELECT e.id AS "ID", 
          e.first_name AS "First_Name", 
          e.last_name AS "Last_Name", 
          r.title AS "Title", 
          d.name AS "Department", 
          r.salary "Salary", 
          CONCAT(m.first_name , " ", m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    LEFT JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id AND d.id = ${department_id}
    ORDER BY id
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const viewAllManagers = function() {
  return db.promise().execute(`
      SELECT e.id AS "ID",
          CONCAT("[",  d.name, "] ", e.first_name , " ",  e.last_name) AS "Name"
      FROM employee e 
      LEFT JOIN employee m ON e.manager_id = m.id
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      WHERE r.title LIKE '%lead%'
      ORDER BY id
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

// WHERE e.manager_id IS NULL

const viewEmployeeByManager = function(manager_id) {
  // console.log(`manager_id: ${manager_id}`);
  return db.promise().execute(`
    SELECT e.id AS "ID", 
          e.first_name AS "First_Name", 
          e.last_name AS "Last_Name", 
          r.title AS "Title", 
          d.name AS "Department", 
          r.salary "Salary"
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    WHERE e.manager_id = ${manager_id}
    ORDER BY id
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const viewAllRoles = function() {
  return db.promise().execute(`
    SELECT r.id,
          r.title,
          r.salary,
          d.name AS department
    FROM role r
    LEFT JOIN department d ON r.department_id = d.id
    ORDER BY id
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const addEmployee = function(employee) {
  return db.promise().execute(`
    INSERT INTO employee (first_name, last_name, role_id, manager_id) 
              VALUES  ('${employee.first_name}',    '${employee.last_name}',    ${employee.role}, ${employee.manager} )
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const removeEmployee = function(employee_id) {
  return db.promise().execute(`
    DELETE FROM employee
    WHERE id = ${employee_id}
  ;`)
  .catch(err => {
    console.log(err);
  });
}

const updateEmployeeRole = function(employee_id, role_id) {
  return db.promise().execute(`
    UPDATE employee
    SET
      role_id = ${role_id}
    WHERE
      id = ${employee_id}
  ;`)
  .catch(err => {
    console.log(err);
  });
}

const updateEmployeeManager = function(employee_id, manager_id) {
  return db.promise().execute(`
  UPDATE employee
  SET
    manager_id = ${manager_id}
  WHERE
    id = ${employee_id}
  ;`)
  .catch(err => {
    console.log(err);
  });
}

const addRole = function(title, salary, department_id) {
  return db.promise().execute(`
    INSERT INTO role (title, salary, department_id) 
      VALUES  ('${title}',    ${salary},    ${department_id} )
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const editRole = function(role_id, title, salary, department_id) {
  return db.promise().execute(`
    UPDATE role
    SET
      title = '${title}',
      salary = ${salary},
      department_id = ${department_id}
    WHERE
      id = ${role_id}
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const deleteRole = function(role_id) {
  // console.log("role_id");
  // console.log(role_id);
  return db.promise().execute(`
    DELETE FROM role
    WHERE id = ${role_id}
  ;`)
  .catch(err => {
    console.log(err);
  });
}

const addDepartment = function(name) {
  return db.promise().execute(`
  INSERT INTO department (name) 
    VALUES  ('${name}')
  ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const editDepartment = function(department_id, name) {
  return db.promise().execute(`
    UPDATE department
    SET
      name = '${name}'
    WHERE
      id = ${department_id}
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const deleteDepartment = function(department_id) {
  // console.log("department_id");
  // console.log(department_id);
  return db.promise().execute(`
    DELETE FROM role
    WHERE id = ${department_id}
  ;`)
  .catch(err => {
    console.log(err);
  });
}

module.exports = {
  viewAllEmployees,
  viewAllDepartments,
  viewAllManagers,
  viewAllRoles,

  viewEmployeeByDepartment,
  viewEmployeeByManager,

  addEmployee,
  removeEmployee,
  updateEmployeeRole,
  updateEmployeeManager,

  addRole,
  editRole,
  deleteRole,

  addDepartment,
  editDepartment,
  deleteDepartment
}