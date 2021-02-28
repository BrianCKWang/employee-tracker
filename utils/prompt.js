const inquirer = require('inquirer');
const sendQuery = require('../db/queries');

const forDepartment = () => {
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

const forSelectRole = () => {
  let roleArr = [];

  return sendQuery.viewAllRoles()
  .then((response) => {
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

    ans.role_id = roleArr.find(element => element.title == ans.role_id).id;
    return ans;
  })
  .catch(console.log);
}

const forSelectDepartment = () => {
  let departmentArr = [];

  return sendQuery.viewAllDepartments()
  .then((response) => {
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
    ans.department_id = departmentArr.find(element => element.name == ans.department_id).id;
    return ans;
  })
  .catch(console.log);
}

const forRoleInfo = () => {
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

const forEmployee = () => {
  let roleArr = [];
  let managerArr = [];
  let departmentOfRole = '';
  let managerChoices = [];
  let firstAns = {};

  return sendQuery.viewAllRoles()
  .then(response => {
    roleArr = response[0];
    return;
  })
  .then(() => sendQuery.viewAllManagers())
  .then(response => {
    managerArr = response[0];
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
    ans.role = roleArr.find(element => element.title == ans.role).id;
    if(ans.manager != null){
      ans.manager = managerArr.find(element => element.Name == ans.manager).ID;
    }
    return ans;
  })
  .catch(console.log);
}

const forViewChoice = (choiceArr, message) => {
  // console.log("choiceArr");
  // console.log(choiceArr);
  
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

module.exports = {
  forDepartment,
  forSelectRole,
  forSelectDepartment,
  forRoleInfo,
  forEmployee,
  forViewChoice
}