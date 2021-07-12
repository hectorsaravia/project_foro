const db = require('./config');

//función asíncrona para mostrar datos del usuario
module.exports = async function mostrar_usuario (data) {

 //variable result que será el resultado del ejercicio
 let result;

 //query que busca en la base de datos los datos del usuario
 await db.promise().query(`SELECT email,rol,name,rut FROM users WHERE rut=?`,[data.rut])
 .then( ([rows, fields]) => {

   //si no existe el usuario, el resultado entonces es falso
   if (rows.length === 0) result = false;

   //si el resultado existe, se copia a la variable result
   else result = rows[0];
 })

 //despliegue en consola del usuario a mostrar y retorno
 console.log(`usuario mostrado: ${JSON.stringify(result)}`);
 return result;
}
