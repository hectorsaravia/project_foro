const db = require('./config');

//función asíncrona para el registro de un nuevo curso
module.exports = async function registrar_curso(data) {
 
 //definición de variable result que será el retorno
 let result;
 
 //primero se obtiene el id del nombre del curso a registrar
 let [rows, fields] = await db.promise().query(`SELECT id FROM courses WHERE name=?`, [data.name_course])

 //si no existe el resultado, se retorna un false
 if (rows.lenght === 0) result = false;

 //en otro caso se ejecuta entonces la inserción
 else {
  
  //la variable id course es el id que se obtiene en la consolta anterior
  const id_course = rows[0].id;

  //se ejecuta la inserción en la base de datos
  await db.promise().query(`INSERT INTO users_courses(email_user,id_courses) VALUES(?, ?)`, [data.email, id_course])
  .then( ([rows,fields]) => {

   //se verifica si la inserción ocurrió, en ese caso el resultado es true, en otro caso es false
   if (rows.affectedRows === 1) result = true;
   else result = false;

  })

  //si es que ocurrió un error, el resultado es ese error
  .catch( (error) => {
   result = error;
  })
 }

 //el retorno es la variable resultado y se acusa el resultado de la operación por consola
 console.log(`curso registrado: ${result}`);
 return result;
};