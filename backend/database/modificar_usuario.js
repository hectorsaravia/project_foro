const db = require('./config');
const bcrypt = require('bcrypt');
const comprobar_usuario = require('./comprobar_usuario');

//función asíncrona para poder modificar el usuario
module.exports = async function modificar_usuario(data) {

 //declaración de la variable result que será el retorno
 let result;

 //primero se busca si el usuario existe
 const status = comprobar_usuario(data);

 //si el usuario existe, entonces no se realiza la modificación
 //en otro caso se procede a realizar la inserción
 if (status === false) result = false;
 else {

  //se encripta la contraseña y se obtiene su hash bcrypt
  hash = bcrypt.hashSync(data.password,10);

  //se procede a realizar la actualización
  db.promise().query(`UPDATE users SET password = ?,name = ?,rol =? WHERE rut = ?;) `,
  [hash, data.name, data.rol, data.rut])
  .then( ([rows,fields]) => {

   //si la modificación ocurrió se retorno true, en otro caso es false
   if (rows.affectedRows === 1) result = true;
   else result = false;
  })


 console.log(`se realizó la modificación; ${result}`);
 return result;
 };
}