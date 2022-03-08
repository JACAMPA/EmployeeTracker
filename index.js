const mysql = require('mysql2');
const inquirer = require('inquirer');
const Ctable = require('console.table');



const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'jcTRUST88',
      database: 'employee_db'
    },
    console.log(`Connected to the courses_db database.`)
  );
  const init =()=> {
    inquirer.prompt([
        {
            name: "name",
            type: "list",
            message: "What would you like to do?",
            choices: [
             "View roles",
             "View departments ", 
             "View employees",
             "Add department",
             "Add role",
             "Add employee",
             "Update employee role", 
             "Finished"]
        },
    ])
    .then(choices => {
        switch(choices.name) {
            case "View roles":
                viewAll("ROLES");
                break;
            case "View departments":
                viewAll("DEPARTMENTS");
                break;
            case "View employees":
                viewAll("EMPLOYEE");
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Update employee role":
                updateRole();
                break;
            default:
                db.end();

        }
    })
    .catch(err => {
        console.error(err);
    })
}

const viewAll = (tables) => {
   let query;
   if (tables === "DEPARTMENT") {
       query= `SELECT * FROM department`;
   } else if (tables==="ROLES") {
       query= `SELECT * FROM roles JOIN department ON roles.department_id= department.id`;
   } else  {
       query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
       FROM employee e
       LEFT JOIN roles r
         ON e.roles_id = r.id
       LEFT JOIN department d
       ON d.id = r.department_id
       LEFT JOIN employee m
         ON m.id = e.manager_id`
   }
   db.query(query, (err, res)=>{
       if (err) throw (err);
       console.table(res);
       init();
   })
}

const addDepartment = () => {
   inquirer.prompt([
       {
           type: "input",
           name: "name",
           message: "What is the name of the new department?"
       }
   ])
   .then(response =>{
       const query = 'INSERT INTO department (name) VALUES(?)';
       db.query(query, [response.name], (err, res) => {
           if (err) throw err;
           console.log(`Added ${response.name} department at id ${res.insertId}`);
           init();
       })
   })
   .catch(err => {
       console.error(err)
   })
}

const addRole = () => {
   const departments =[];
   db.query('SELECT * FROM department' , (err,res)=> {
       if (err) throw err;
   res.forEach(department => {
       let object = {
           name: department.name,
           value: department.id
       }
       departments.push(object);
       })
   })
 
   inquirer.prompt([
       {
          type: "input",
          name: "title",
          message: "What is the title of the new role?"
       },
       {
           type: "input",
           name: "salary",
           message: "What is the salary of this role?"
       },
       {
           type: "list",
           name: "departments",
           choices: departments,
           message: "What department is the role in?"
       }
   ])
   .then(response => {
       const query = `INSERT INTO roles (title, salary, department_id) VALUES (?)`;
       db.query(query, [[response.title, response.salary, response.departments]], (err, res)=>{
           if(err) throw err;
           console.log(`Added ${response.title} role at id ${res.insertId}`);
           init();
       })
   })
   .catch(err => {
       console.error(err);
   })
}

const addEmployee = () => {
  db.query(`SELECT * FROM employee`, (err, res) => {
      if(err) throw err;
      const employeeSelection = [
          {
          name: 'None',
          value: 0
          }
      ]
      res.forEach(({first_name, last_name, id}) => {
          employeeSelection.push({
              name: first_name + '' + last_name,
              value: id
          })
      })
      db.query("SELECT * FROM roles", (err, res)=>{
          if(err) throw err;
          const roleChoice = [];
          res.forEach(({title, id})=> {
              roleChoice.push({
                  name: title,
                  value: id
              })
          })
          inquirer.prompt([
              {
                  type: "input",
                  name: "first_name",
                  message: "Whats employees first name?"
              },
              {
                  type: "input",
                  name: "last_name",
                  message: "Whats employees last name?"
              },
              {
                  type: "list",
                  name: "roles_id",
                  choices: roleChoice,
                  message: "Whats employees role?"
              },
              {
                  type: "list",
                  name: "manager_id",
                  choices: employeeSelection,
                  message: "Whos the employees manager? (Null if they are a manager)"
              }
          ])
          .then(response => {
              const query = `INSERT INTO EMPLOYEE (first_name, last_name, roles_id, manager_id) VALUES(?)`;
              let manager_id = response.manager_id !==0? response.manager_id: null;
              db.query(query, [[response.first_name, response.last_name, response.roles_id, response.manager_id]], (err,res)=> {
                  if (err) throw err;
                  console.log(`Added ${response.first_name} ${response.last_name} to employees with id ${res.insertId}`);
                  init();
              })
          })
          .catch(err => {
              console.error(err);
          })
      })
  })
}

const updateRole = () => {
  db.query("SELECT * FROM EMPLOYEE", (err, res)=> {
      if (err) throw err;
      const employeeSelection = [];
      res.forEach(({first_name, last_name, id})=>{
          employeeSelection.push({
              name: first_name + '' + last_name,
              value: id
          })
      })
      db.query("SELECT * FROM roles", (err, res)=>{
          if(err) throw err;
          const roleSelection = [];
          res.forEach(({title, id})=>{
              roleSelection.push({
                  name: title,
                  value: id
              })
          })
          inquirer.prompt([
              {
                  name: "id",
                  type: "list",
                  choices: employeeSelection,
                  message: "Which employees role would you update?"
              },
              {
                  name: "roles_id",
                  type: "list",
                  choices: roleSelection,
                  message: "Whats the employees new role?"
              }
          ])
          .then(response =>{
              const query = `UPDATE employee SET ? WHERE ??= ?;`;
              db.query(query, [
                  {roles_id: response.roles_id},
                  "id",
                  response.id
              ], (err, res) => {
                  if(err) throw err;
                  console.log("Updated employees role!");
                  init();
              })
          })
          .catch(err => {
              console.error(err);
          })
      })
  })
}
init();