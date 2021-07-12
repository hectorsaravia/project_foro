const db = require('./config');
const bcrypt = require('bcrypt');

//función asíncrona que realiza el login de las cuentas a la base de datos
module.exports = async function login (data) {
  
 //se define la variable check que será true o false si las
 //contraseñas coinciden o no
 let check;

 //query en la base de datos que busca el rut en la base de datos
 await db.promise().query(`SELECT password FROM users WHERE email=?;`, [data.email])
 .then( ([rows,fields]) => {

   //si no hay resultados, entonces el rut no existe en la base de datos
   if (rows.length === 0) check = false;

   //se comparan la contraseña dada y la contraseña en la base desencriptada
   else check = bcrypt.compareSync(data.password,rows[0].password);
 })

 //si hay un error, se retorna el error
 .catch((error) => {
   check = error;
 })

 //se retorna el valor de check
 console.log(`contraseñas coinciden: ${check}`);
 return check;
}
