const db = require('./db/database');
const cTable = require('console.table');
const inquirer = require('inquirer');
const sendQuery = require('./db/queries');

const isDebugMode = false;

const showTable = ([rows]) => {
  if(isDebugMode){
    console.log(rows);
  }
  console.log();
  console.table(rows);
}

const promptEmployee = () => {
  let roleArr = [];
  let managerArr = [];
  let departmentOfRole = '';
  let managerChoices = [];
  let firstAns = {};

  return sendQuery.viewAllRoles()
  .then(response => {
    roleArr = response[0];
    // console.log(roleArr);
    return;
  })
  .then(() => sendQuery.viewAllManagers())
  .then(response => {
    managerArr = response[0];
    // console.log(managerArr);
    return;
  })
  .then(() => inquirer.prompt([{
    type: 'input',
    name: 'first_name',
    message: 'Please enter first name',
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please enter a valid first name!');
        return false;
      }
    }
  },
  {
    type: 'input',
    name: 'last_name',
    message: 'Please enter last name',
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please enter a valid last name!');
        return false;
      }
    }
  },
  {
    type: 'rawlist',
    name: 'role',
    message: 'Please select role',
    choices: roleArr.map(choice => choice.title),
    default: 0,
    loop: false
  }]))
  .then(ans => {
    firstAns = ans;
    // console.log(firstAns);
    departmentOfRole = roleArr.find(element => element.title == firstAns.role).department;
    // console.log("departmentOfRole");
    // console.log(departmentOfRole);
    // console.log("managerArr.map(choice => choice.Name).filter(department => department.includes(departmentOfRole))");
    // console.log(managerArr.map(choice => choice.Name).filter(department => department.includes(departmentOfRole)));
    managerChoices = managerArr.map(choice => choice.Name).filter(department => department.includes(departmentOfRole));
    if(!ans.role.includes('lead')){
      return inquirer.prompt({
        type: 'rawlist',
        name: 'manager',
        message: 'Please select manager',
        choices: managerChoices,
        default: 0,
        loop: false
      })
    }
    else{
      return {manager: null};
    }

  })
  .then(ans => Object.assign(firstAns, ans))
  .then(ans => {
    // console.log(ans);
    // console.log(roleArr);
    // console.log(managerArr);
    ans.role = roleArr.find(element => element.title == ans.role).id;
    if(ans.manager != null){
      ans.manager = managerArr.find(element => element.Name == ans.manager).ID;
    }
    return ans;
  })
  .catch(console.log);
}

const promptViewChoice = (choiceArr, message) => {
  return inquirer.prompt({
    type: 'rawlist',
    name: 'action',
    message: message,
    choices: choiceArr.map(choice => choice[0]),
    default: 0,
    loop: false
  })
  .then(ans => {
    return choiceArr.filter(choice => choice[0] === ans.action)[0][1];
  })
  .catch(console.log);
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
    default: 0,
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
        sendQuery.viewAllDepartments()
        .then((rows) => rows[0].map(department => [department.name, department.id]))
        .then(departmentArr => promptViewChoice(departmentArr, 'Which department would you like to view?'))
        .then(department_id => sendQuery.viewEmployeeByDepartment(department_id))
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case'View All Employees By Manager':
        sendQuery.viewAllManagers()
        .then((rows) => rows[0].map(manager => [manager.Name, manager.ID]))
        .then(ManagerArr => promptViewChoice(ManagerArr, 'Which manager would you like to view?'))
        .then(manager_id => sendQuery.viewEmployeeByManager(manager_id))
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'Add Employee':
        promptEmployee()
        .then(employee => sendQuery.addEmployee(employee))
        .then(() => sendQuery.viewAllEmployees())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'Remove Employee':
        sendQuery.viewAllEmployees()
        // .then((rows) => console.log(rows[0]))
        .then((rows) => rows[0].map(employee => [['[', employee.Title, '] ', employee.First_Name, ' ', employee.Last_Name].join(''), employee.ID]))
        .then(employeeArr => promptViewChoice(employeeArr, 'Which employee would you like to remove?'))
        .then(employee_id => sendQuery.removeEmployee(employee_id))
        // .then((rows) => showTable(rows))
        // .then((rows) => console.log(rows))
        // .then((ans) => console.log(ans))
        // .then((rows) => showTable(rows[0].map(employee => [employee.First_Name, employee.Last_Name, employee.ID])))
        .then(() => sendQuery.viewAllEmployees())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
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