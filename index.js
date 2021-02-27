const db = require('./db/database');
const cTable = require('console.table');
const inquirer = require('inquirer');
const sendQuery = require('./db/queries');

const isDebugMode = false;

const showTable = ([rows]) => {
  if(isDebugMode){
    console.log(rows);
  }
  console.table(rows);
}

const promptAction = () => {
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
              'Edit Role',
              'View Department',
              'Edit Department',
              'Exit'
            ],
    default: 'View All Employees',
    loop: false
  })
  .then(response => {
    // console.log(`response.action${response.action}`);
    switch(response.action){
      case 'View All Employees':
        sendQuery.viewAllEmployees()
          .then((rows) => showTable(rows))
          .then(() => promptAction())
          .catch(console.log);
        return;
      case 'View All Employees By Department':
          sendQuery.viewAllEmployees_byDepartment()
          .then((rows) => showTable(rows))
          .then(() => promptAction())
          .catch(console.log);
        return; 
      case'View All Employees By Manager':
        return; 
      case'Add Employee':
        return; 
      case'Remove Employee':
        return; 
      case'Update Employee Role':
        return; 
      case'Update Employee Manager':
        return; 
      case'View Roles':
        return;
      case'Edit Role':
        return;
      case'View Department':
        return;
      case'Edit Department':
        return;
      case'Exit':
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