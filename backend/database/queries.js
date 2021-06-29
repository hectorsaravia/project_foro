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

const login = (data,result) => {
 db.query(`SELECT password FROM users WHERE rut=?;`, [data.rut],
  (err,results) => {
  if (err) {
   console.log(err);
   result(err,null);
  } else {
   bcrypt.compare(data.password, results[0].password, (error,check) => {
    if (error) {
     console.log(error);
    } else {
     result(null,check);
    }
   });
  };
 });
}

const register = (data, result) => {
 password = data.password;
 bcrypt.genSalt(saltRounds, function(err,salt){
  bcrypt.hash(password, salt, function(err, hash){
   db.query(`INSERT INTO users(email,password,rut,name,rol) VALUES(?,?,?,?,?)`,
   [data.email, hash, data.rut, data.name, data.rol],
   (err, results) => {
    if (err) {
     console.log(err);
     result(err,null);
    } else {
     result(null,results);
    };
   }); 
  });
 });
}




module.exports = {
 getTables,
 register,
 login
}