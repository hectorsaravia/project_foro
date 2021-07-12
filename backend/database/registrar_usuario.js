const db = require('./config');
const bcrypt = require('bcrypt');

//función asíncrona que realiza el registro de las cuentas
module.exports = async function registrar_usuario (data) {

 //variable que retornará el resultado al final de la ejecución
 let result;

 //la variable hash es el resultado de usar bcrypt para encriptar la contraseña
 //provista para ser usada en la base de datos
 const hash = bcrypt.hashSync(data.password, 10);

 //si es que el usuario ya existe, se prohibe una nueva inserción
 let [rows,fields] = await db.promise().query(`SELECT rut,email FROM users WHERE rut=? OR email=?`, 
 [data.rut, data.email]);

 //si es que ya existe en la base de datos entonces el resultado será false
 if (rows.length > 0) result = false;

 //en otro caso se procede a realizar la inserción
 else {

   //query que inserta un nuevo correo a la base de datos
   await db.promise().query(`INSERT INTO users(email,password,rut,name,rol) VALUES(?,?,?,?,?)`,
   [data.email, hash, data.rut, data.name, data.rol])
   .then( ([rows,fields]) => {

     //se retorna el resultado de la inserción realizada, si es que ocurrió como se esperaba
     //se retorna el mensaje de vuelta
     result = rows.affectedRows;
     if (result === 1) result = true;
     else result = false;

   })
   .catch((error) => {
     result = error;
   })
 } 

 //retorno del resultado
 console.log(`resultado de registro: ${result}`);
 return result;
}