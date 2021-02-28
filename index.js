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
  console.table(rows.length != 0 ? rows : [{ID: 'Empty', First_Name: '', Last_Name: '', Title: '', Department: '', Salary: '', Manager: '' }]);
}

const promptDepartment = () => {
  return inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Please enter name of the department.',
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please enter a valid name!');
        return false;
      }
    }
  }])
  .catch(console.log);
}

const promptSelectRole = () => {
  let roleArr = [];

  return sendQuery.viewAllRoles()
  .then((response) => {
    // console.log("response[0]");
    // console.log(response[0]);
    roleArr = response[0];
    return;
  })
  .then(() => inquirer.prompt([
  {
    type: 'rawlist',
    name: 'role_id',
    message: 'Please select role',
    choices: roleArr.map(choice => choice.title),
    default: 0,
    loop: false
  }]))
  .then(ans => {
    // console.log("ans");
    // console.log(ans);
    // console.log("roleArr");
    // console.log(roleArr);
    // console.log(roleArr.find(element => element.title == ans));
    ans.role_id = roleArr.find(element => element.title == ans.role_id).id;
    return ans;
  })
  .catch(console.log);
}

const promptSelectDepartment = () => {
  let departmentArr = [];

  return sendQuery.viewAllDepartments()
  .then((response) => {
    // console.log("response[0]");
    // console.log(response[0]);
    departmentArr = response[0];
    return;
  })
  .then(() => inquirer.prompt([
  {
    type: 'rawlist',
    name: 'department_id',
    message: 'Please select department',
    choices: departmentArr.map(choice => choice.name),
    default: 0,
    loop: false
  }]))
  .then(ans => {
    // console.log("ans");
    // console.log(ans);
    // console.log("departmentArr");
    // console.log(departmentArr);
    // console.log(departmentArr.find(element => element.name == ans.department_id));
    ans.department_id = departmentArr.find(element => element.name == ans.department_id).id;
    // console.log(ans);
    return ans;
  })
  .catch(console.log);
}

const promptRoleInfo = () => {
  let departmentArr = [];

  return sendQuery.viewAllDepartments()
  .then((response) => {
    departmentArr = response[0];
    return;
  })
  .then(() => inquirer.prompt([{
    type: 'input',
    name: 'title',
    message: 'Please enter name of the role.',
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please enter a valid name!');
        return false;
      }
    }
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Please enter salary',
    validate: input => {

      if (Number.parseInt(input)) {
        return true;
      } else {
        console.log('Please enter a valid salary!');
        return false;
      }
    }
  },
  {
    type: 'rawlist',
    name: 'department_id',
    message: 'Please select department',
    choices: departmentArr.map(choice => choice.name),
    default: 0,
    loop: false
  }]))
  .then(ans => {
    ans.department_id = departmentArr.find(element => element.name == ans.department_id).id;
    return ans;
  })
  .catch(console.log);
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
    departmentOfRole = roleArr.find(element => element.title == firstAns.role).department;
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
        .then((rows) => rows[0].map(employee => [['[', employee.Title, '] ', employee.First_Name, ' ', employee.Last_Name].join(''), employee.ID]))
        .then(employeeArr => promptViewChoice(employeeArr, 'Which employee would you like to remove?'))
        .then(employee_id => sendQuery.removeEmployee(employee_id))
        .then(() => sendQuery.viewAllEmployees())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return; 
      case'Update Employee Role':
        sendQuery.viewAllEmployees()
        .then((rows) => rows[0].map(employee => [['[', employee.Title, '] ', employee.First_Name, ' ', employee.Last_Name].join(''), employee.ID]))
        .then(employeeArr => promptViewChoice(employeeArr, 'Which employee would you like to update the role?'))
        .then(employee_id => decisionArr.push(employee_id))
        .then(() => sendQuery.viewAllRoles())
        .then((rows) => rows[0].map(role => [role.title, role.id]))
        .then(roleArr => promptViewChoice(roleArr, 'Which role would you like to apply?'))
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
        .then(employeeArr => promptViewChoice(employeeArr, 'Which employee would you like to update the manager?'))
        .then(employee_id => decisionArr.push(employee_id))
        .then(() => sendQuery.viewAllManagers())
        .then((rows) => rows[0].map(manager => [manager.Name, manager.ID]))
        .then(roleArr => promptViewChoice(roleArr, 'Which manager would you like to apply?'))
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
        promptRoleInfo()
        .then(role => sendQuery.addRole(role.title, role.salary, role.department_id))
        .then(() => sendQuery.viewAllRoles())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Edit Role':
        sendQuery.viewAllRoles()
        .then((rows) => showTable(rows))
        .then(() => promptSelectRole())
        .then(role_id => decisionArr.push(role_id))
        .then(() => promptRoleInfo())
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
        .then(() => promptSelectRole())
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
        promptDepartment()
        .then(department => sendQuery.addDepartment(department.name))
        .then(() => sendQuery.viewAllDepartments())
        .then((rows) => showTable(rows))
        .then(() => promptAction())
        .catch(console.log);
        return;
      case 'Edit Department':
        sendQuery.viewAllDepartments()
        .then((rows) => showTable(rows))
        .then(() => promptSelectDepartment())
        .then(department_id => decisionArr.push(department_id))
        .then(() => promptDepartment())
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
        .then(() => promptSelectDepartment())
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