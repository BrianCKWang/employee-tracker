// const Manager = require('./lib/object/Manager');
// const Engineer = require('./lib/object/Engineer');
// const Intern = require('./lib/object/Intern');
// const inquirer = require('inquirer');
// const generateContent = require('./utils/generateContent');
// const { writeFile, copyFile } = require('./utils/file-handlers')
const db = require('./db/database');

const isDebugMode = false;

// const idSet = new Set();

// const promptManagerDetails = (manager, propertyList) => {
  
//   console.log("");
//   console.log("Please enter manager details: ");
//   return promptFor(manager, propertyList)
//         .then( managerDetail => {
//           let employeeList = {};
//           employeeList.manager = [];
//           employeeList.manager.push(managerDetail);
//           return employeeList;
//         })
//         .catch(err => {
//           console.log(err);
//         });
// }

// const promptEmployeeTypeOrFinish = () => {
//   console.log("");
//   return inquirer.prompt([
//     {
//       type: 'list',
//       name: 'type',
//       message: "Choose a type of employee to add",
//       choices: ['Engineer', 'Intern', 'Finish'],
//       default: 'Finish'
//     }
//   ]);
// };

// const promptFor = (employeeType, propertyList) => {
//   return promptDetails(employeeType, propertyList)
//   .then(employeeType =>{
//     return Promise.resolve(employeeType);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// }

// const promptDetails = (employeeType, propertyList) => {
  
//   if(propertyList.length > 0){
//     const propertyName = propertyList.shift();

//     return inquirer.prompt([
//       {
//         type: 'input',
//         name: propertyName,
//         message: "Please enter " + propertyName + ": ",
//         validate: input => {
          
//           if(input){
//             if(propertyName == 'id'){
//               if(idSet.has(input)){
//                 console.log(" -> id '" + input + "' already exists in system, please enter a unique id!");
//                 return false;
//               }
//             }
//             return true;
//           }
//           else{
//             console.log("Please enter " + propertyName + "!");
//             return false;
//           }
//         }
//       }
//     ])
//     .then(ans => {
//       employeeType[propertyName] = ans[propertyName];
//       if(propertyName == 'id'){
//         idSet.add(ans[propertyName]);
//       }
      
//       return promptDetails(employeeType, propertyList);
//     })
//   }
//   else{
//     return Promise.resolve(employeeType);
//   }
// };

// const promptEmployeeDetails = EmployeeList => {
//   let propertyList;
//   if(!EmployeeList.engineerList){
//     EmployeeList.engineerList = [];
//   }

//   if(!EmployeeList.internList){
//     EmployeeList.internList = [];
//   }

//   return promptEmployeeTypeOrFinish()
//     .then( choice => {
//       switch(choice.type){
//         case 'Engineer':
//           let engineer = new Engineer();
//           propertyList = Object.keys(engineer).filter(word => {
//             return !word.startsWith('get');
//           });
//           console.log("");
//           console.log("Please enter engineer details: ");
//           return promptFor(engineer, propertyList)
//                 .then(employee => {
//                   EmployeeList.engineerList.push(employee);
//                   return EmployeeList;
//                 })
//                 .then(EmployeeList => {
//                   return promptEmployeeDetails(EmployeeList);
//                 })
//                 .catch(err => {
//                   console.log(err);
//                 });
//         case 'Intern':
//           let intern = new Intern();
//           propertyList = Object.keys(intern).filter(word => {
//             return !word.startsWith('get');
//           });
//           console.log("");
//           console.log("Please enter intern details: ");
//           return promptFor(intern, propertyList)
//                 .then(employee => {
//                   EmployeeList.internList.push(employee);
//                   return EmployeeList;
//                 })
//                 .then(EmployeeList => {
//                   return promptEmployeeDetails(EmployeeList);
//                 })
//                 .catch(err => {
//                   console.log(err);
//                 });
//         default:
//           return EmployeeList;
//       }
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }


const migrate = function () {

  // sendQuery(`DROP TABLE IF EXISTS department;`,[]);
  // sendQuery(`DROP TABLE IF EXISTS role;`,[]);
  // sendQuery(`DROP TABLE IF EXISTS employee;`,[]);
  db.promise().query(`DROP TABLE IF EXISTS department;`,[])
  .then( ([rows,fields]) => {
    if(isDebugMode){
      console.log(rows);
    }
  })
  db.promise().query(`CREATE TABLE IF NOT EXISTS department (
                      id INT AUTO_INCREMENT,
                      name VARCHAR(30) NOT NULL, 
                      PRIMARY KEY(id)
  );`,[])
  .then( ([rows,fields]) => {
    if(isDebugMode){
      console.log(rows);
    }
  })
  db.promise().query(`CREATE TABLE IF NOT EXISTS role (
                    id INT AUTO_INCREMENT,
                    title VARCHAR(30) NOT NULL,
                    salary FLOAT NOT NULL,
                    department_id INT NOT NULL, 
                    PRIMARY KEY(id),
                    FOREIGN KEY (department_id) REFERENCES department(id)
  );`,[])
  .then( ([rows,fields]) => {
    if(isDebugMode){
      console.log(rows);
    }
  })
  db.promise().query(`CREATE TABLE IF NOT EXISTS employee (
                    id INT AUTO_INCREMENT,
                    first_name VARCHAR(30) NOT NULL, 
                    last_name VARCHAR(30) NOT NULL, 
                    role_id INT NOT NULL, 
                    manager_id INT,
                    PRIMARY KEY(id),
                    FOREIGN KEY (role_id) REFERENCES role(id),
                    FOREIGN KEY (manager_id) REFERENCES employee(id)
  );`,[])
  .then( ([rows,fields]) => {
    if(isDebugMode){
      console.log(rows);
    }
  })
  db.promise().query(`INSERT INTO department (name) 
            VALUES ('engineering'),
            ('sales')
            ;`,
            []
  )
  .then( ([rows,fields]) => {
    if(isDebugMode){
      console.log(rows);
    }
  })
  // db.promise().query(`INSERT INTO role (title, salary, department) 
  //                     VALUES ('engineering lead', 210000 , 1),
  //                     VALUES ('SDE3', 145000 , 1),
  //                     VALUES ('SDE2', 115000 , 1),
  //                     VALUES ('SDE1', 95000 , 1),
  //                     VALUES ('sales lead', 175000 , 2);
  // `,[])
  // .then( ([rows,fields]) => {
  //   if(isDebugMode){
  //     console.log(rows);
  //   }
  // })
  // db.promise().query(`INSERT INTO department (first_name, last_name, role_id, manager_id) 
  //                   VALUES ('p1_first', 'p1_last', 1, ),
  //                   VALUES ('p2_first', 'p2_last', 2, 1),
  //                   VALUES ('p3_first', 'p3_last', 2, 1),
  //                   VALUES ('p4_first', 'p4_last', 3, 1),
  //                   VALUES ('p5_first', 'p5_last', 3, 1),
  //                   VALUES ('p6_first', 'p6_last', 4, 1),
  //                   VALUES ('p7_first', 'p7_last', 4, 1),
  //                   VALUES ('p8_first', 'p8_last', 4, 1),
  //                   VALUES ('p9_first', 'p9_last', 5, );
  // `,[])
  // .then( ([rows,fields]) => {
  //   if(isDebugMode){
  //     console.log(rows);
  //   }
  // })
  .catch(console.log)
  .then( () => db.end());
}

const seed = function () {

  db.promise().query(`INSERT INTO department (name) 
            VALUES ('engineering'),
            VALUES ('sales');
            `,
  []);

  db.promise().query(`INSERT INTO role (title, salary, department) 
            VALUES ('engineering lead', 210000 , 1),
            VALUES ('SDE3', 145000 , 1),
            VALUES ('SDE2', 115000 , 1),
            VALUES ('SDE1', 95000 , 1),
            VALUES ('sales lead', 175000 , 2);
            `,
  []);

  db.promise().query(`INSERT INTO department (first_name, last_name, role_id, manager_id) 
            VALUES ('p1_first', 'p1_last', 1, ),
            VALUES ('p2_first', 'p2_last', 2, 1),
            VALUES ('p3_first', 'p3_last', 2, 1),
            VALUES ('p4_first', 'p4_last', 3, 1),
            VALUES ('p5_first', 'p5_last', 3, 1),
            VALUES ('p6_first', 'p6_last', 4, 1),
            VALUES ('p7_first', 'p7_last', 4, 1),
            VALUES ('p8_first', 'p8_last', 4, 1),
            VALUES ('p9_first', 'p9_last', 5, );
  `,
[]);
}

const sendQuery = function (sql, params) {
  db.promise().query(sql,params,
    function(err, results) {
      if(err){
        console.log(err);
      }
      else{
        console.log(results);
      }
    
    }
  );
}

function main(){
  migrate();

  // console.log(db);
  // const first_name = 'brian';
  // const last_name = 'wang'; 
  // const  role_id = '1';
  // const  manager_id = '2';

  // const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
  // VALUES (?,?,?,?)`;
  // const params = [first_name, last_name, role_id, manager_id];

  // sendQuery(sql, params);
  // let manager = new Manager();
  // let propertyList = Object.keys(manager).filter(word => {
  //   return !word.startsWith('get');
  // });
  // promptManagerDetails(manager, propertyList)
  // .then(employeeList => {
  //   return promptEmployeeDetails(employeeList);
  // })
  // .then(employeeList => {
  //   // console.log(employeeList);
  //   console.log("");
  //   console.log("Generting content...");
  //   return generateContent(employeeList);
  // })
  // .then(contentData => {
  //   console.log("Saving file...");
  //   return writeFile('./dist/index.html', contentData);
  // })
  // .then(writeFileResponse => {
  //   console.log(writeFileResponse.message);
  // })
  // .then(() => {
  //   console.log("Copying file...");
  //   return copyFile('./src/style.css', './dist/style.css');
  // })
  // .then(copyFileResponse => {
  //   console.log(copyFileResponse.message);
  // })
  // .catch(err => {
  //   console.log(err);
  // });
}

main();