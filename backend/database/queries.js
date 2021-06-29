const db = require('./config');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const getTables = (result) => {
 db.query(`show tables;`, (err, results) => {
  if (err) {
   console.log(err);
   result(err, null);
  } else {
   result(null,results);
  }
 });
}

const register = (data, result) => {
 password = data.password;
 bcrypt.hash(password, saltRounds)
 .then(function (hashPassword) {
  password = hashPassword;
 }).catch(function (err) {
  console.log(err);
  result(err,null);
 });
 db.query(`INSERT INTO users(email,password,rut,name,rol) VALUES(?,?,?,?,?)`,
  [data.email, password, data.rut, data.name, data.rol],
  (err, results) => {
   if (err) {
    console.log(err);
    result(err,null);
   } else {
    result(null,results);
   };
  }); 
}




module.exports = {
 getTables,
 register
}