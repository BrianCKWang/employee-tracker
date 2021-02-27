const db = require('./database');

const viewAllEmployees = function() {
  return db.promise().execute(`
      SELECT e.id AS "ID", 
            e.first_name AS "First Name", 
            e.last_name AS "Last Name", 
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

const viewAllEmployees_byDepartment = function() {
  return db.promise().execute(`
    SELECT e.id AS "ID", 
          e.first_name AS "First Name", 
          e.last_name AS "Last Name", 
          r.title AS "Title", 
          d.name AS "Department", 
          r.salary "Salary", 
          CONCAT(m.first_name , " ", m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    ORDER BY department_id, id
    ;`
  )
  .catch(err => {
    console.log(err);
  });
}

const viewAllEmployees_byManager = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const addEmployee = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const removeEmployee = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const updateEmployeeRole = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const updateEmployeeManager = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const viewRoles = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const editRole = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const viewDepartment = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

const editDepartment = function() {
  return db.promise().execute(
  )
  .catch(err => {
    console.log(err);
  });
}

module.exports = {
  viewAllEmployees,
  viewAllEmployees_byDepartment
}