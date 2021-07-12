const db = require('./config');

module.exports = async function comprobar_usuario(data) {

 //variable que retornará el resultado al final de la ejecución
 let result;

 //se busca si el usuario existe
 let [rows,fields] = await db.promise().query(`SELECT * FROM users WHERE rut=? OR email=?`, 
 [data.rut, data.email]);

 //si es que ya existe en la base de datos entonces el resultado será false
 if (rows.length > 0) result = false;
 else result = true;

 return result;
}