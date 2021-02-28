const db = require('./db/database');
const cTable = require('console.table');
const inquirer = require('inquirer');
const sendQuery = require('./db/queries');
const toPrompt = require('./utils/prompt')
const isDebugMode = false;

const showTable = ([rows]) => {
  if(isDebugMode){
    console.log(rows);
  }
  console.log();
  console.table(rows.length != 0 ? rows : [{ID: 'Empty'}]);
}

const promptAction = () => {
  let decisionArr = [];

  return inquirer.prompt({
    type: 'rawlist',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View All Employees', 
              'View All Employees By Department', 
              'View All Employees By Manager', 
              'Add Employee', 
              'Remove Employee', 
              'Update Employee Role', 
              'Update Employee Manager', 
              'View Roles',
              'Add Role',
              'Edit Role',
              'Delete Role',
              'View Department',
              'Add Department',
              'Edit Department',
              'Delete Department',
              'Exit'
            ],
    default: 0,
    loop: false
  })
  .then(response => {
    switch(response.action){
      case 'View All Employees':
        sendQuery.viewAllEmployees()
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'View All Employees By Department':
        sendQuery.viewAllDepartments()
        .then((rows) => rows[0].map(department => [department.name, department.id]))
        .then(departmentArr => toPrompt.forViewChoice(departmentArr, 'Which department would you like to view?'))
        .then(department_id => sendQuery.viewEmployeeByDepartment(department_id))
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case'View All Employees By Manager':
        sendQuery.viewAllManagers()
        .then((rows) => rows[0].map(manager => [manager.Name, manager.ID]))
        .then(ManagerArr => toPrompt.forViewChoice(ManagerArr, 'Which manager would you like to view?'))
        .then(manager_id => sendQuery.viewEmployeeByManager(manager_id))
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'Add Employee':
        toPrompt.forEmployee()
        .then(employee => sendQuery.addEmployee(employee))
        .then(() => sendQuery.viewAllEmployees())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'Remove Employee':
        sendQuery.viewAllEmployees()
        .then((rows) => rows[0].map(employee => [['[', employee.Title, '] ', employee.First_Name, ' ', employee.Last_Name].join(''), employee.ID]))
        .then(employeeArr => toPrompt.forViewChoice(employeeArr, 'Which employee would you like to remove?'))
        .then(employee_id => sendQuery.removeEmployee(employee_id))
        .then(() => sendQuery.viewAllEmployees())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'Update Employee Role':
        sendQuery.viewAllEmployees()
        .then((rows) => rows[0].map(employee => [['[', employee.Title, '] ', employee.First_Name, ' ', employee.Last_Name].join(''), employee.ID]))
        .then(employeeArr => toPrompt.forViewChoice(employeeArr, 'Which employee would you like to update the role?'))
        .then(employee_id => decisionArr.push(employee_id))
        .then(() => sendQuery.viewAllRoles())
        .then((rows) => rows[0].map(role => [role.title, role.id]))
        .then(roleArr => toPrompt.forViewChoice(roleArr, 'Which role would you like to apply?'))
        .then(role_id => decisionArr.push(role_id))
        .then(() => sendQuery.updateEmployeeRole(decisionArr[0], decisionArr[1]))
        .then(() => decisionArr = [])
        .then(() => sendQuery.viewAllEmployees())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'Update Employee Manager':
        sendQuery.viewAllEmployees()
        .then((rows) => rows[0].map(employee => [['[', employee.Title, '] ', employee.First_Name, ' ', employee.Last_Name].join(''), employee.ID]))
        .then(employeeArr => toPrompt.forViewChoice(employeeArr, 'Which employee would you like to update the manager?'))
        .then(employee_id => decisionArr.push(employee_id))
        .then(() => sendQuery.viewAllManagers())
        .then((rows) => {rows[0].unshift({ID: null, Name: 'This person is a manager'}); return rows[0];})
        .then((rows) => rows.map(manager => [manager.Name, manager.ID]))
        .then(roleArr => toPrompt.forViewChoice(roleArr, 'Which manager would you like to apply?'))
        .then(manager_id => decisionArr.push(manager_id))
        .then(() => sendQuery.updateEmployeeManager(decisionArr[0], decisionArr[1]))
        .then(() => decisionArr = [])
        .then(() => sendQuery.viewAllEmployees())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'View Roles':
        sendQuery.viewAllRoles()
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Add Role':
        toPrompt.forRoleInfo()
        .then(role => sendQuery.addRole(role.title, role.salary, role.department_id))
        .then(() => sendQuery.viewAllRoles())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Edit Role':
        sendQuery.viewAllRoles()
        .then((rows) => showTable(rows))
        .then(() => toPrompt.forSelectRole())
        .then(role_id => decisionArr.push(role_id))
        .then(() => toPrompt.forRoleInfo())
        .then(roleInfo => decisionArr.push(roleInfo))
        .then(() => sendQuery.editRole(decisionArr[0].role_id, decisionArr[1].title, decisionArr[1].salary, decisionArr[1].department_id))
        .then(() => decisionArr = [])
        .then(() => sendQuery.viewAllRoles())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Delete Role':
        sendQuery.viewAllRoles()
        .then((rows) => rows[0].map(role => [role.title]))
        .then(() => toPrompt.forSelectRole())
        .then(role => sendQuery.deleteRole(role.role_id))
        .then(() => sendQuery.viewAllRoles())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case'View Department':
        sendQuery.viewAllDepartments()
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Add Department':
        toPrompt.forDepartment()
        .then(department => sendQuery.addDepartment(department.name))
        .then(() => sendQuery.viewAllDepartments())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Edit Department':
        sendQuery.viewAllDepartments()
        .then((rows) => showTable(rows))
        .then(() => toPrompt.forSelectDepartment())
        .then(department_id => decisionArr.push(department_id))
        .then(() => toPrompt.forDepartment())
        .then(departmentInfo => decisionArr.push(departmentInfo))
        .then(() => sendQuery.editDepartment(decisionArr[0].department_id, decisionArr[1].name))
        .then(() => sendQuery.viewAllDepartments())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Delete Department':
        sendQuery.viewAllDepartments()
        .then((rows) => rows[0].map(department => [department.name]))
        .then(() => toPrompt.forSelectDepartment())
        .then(department => sendQuery.deleteDepartment(department.department_id))
        .then(() => sendQuery.viewAllDepartments())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Exit':
      default:
        db.end();
        return;
    }
  })
  .catch(err => {
    console.log(err);
  });
}

function main(){
  sendQuery.viewAllEmployees()
  .then((rows) => showTable(rows))
  .then(() => promptAction())
  .catch(console.log);
}

main();