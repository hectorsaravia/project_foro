const db = require('./config');
const comprobar_usuario = require('./comprobar_usuario');
const bcrypt = require('bcrypt');

//función asíncrona que realiza el registro de las cuentas
module.exports = async function registrar_usuario (data) {

  //variable que retornará el resultado al final de la ejecución
  let result;

  //primero se busca si el usuario existe
  const status = await comprobar_usuario(data);

  //si el usuario existe, entonces no se realiza la inserción
  //en otro caso se procede a realizar la inserción
  if (status === false) result = false;
  else {

    //la variable hash es el resultado de usar bcrypt para encriptar la contraseña
    //provista para ser usada en la base de datos
    const hash = bcrypt.hashSync(data.password, 10);
    
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

    //en caso de error, este será el resultado
    .catch((error) => {
      result = error;
    })

    //se define rows como el resultado de las carreras 
    const [rows,fields] = await db.promise().query(`SELECT id FROM courses WHERE id_career=?;`, [data.id_career]);
    
    //si no hay resultados, entonces el resultado es falso, en otro caso se realiza la inserción
    if(rows.length === 0) result = false;
    else {
      
      //se realiza una query por curso que hay
      for(let row of rows) {

        console.log(row.id);

        //se realiza la inserción por cada valor que se recibe
        await db.promise().query(`INSERT INTO users_courses(email_user,id_courses) VALUES(?,?)`,[data.email,row.id])
        .then( ([newrows,newfields]) => {
          
          //en caso de que no se modificaran los valores, resultado es false, en otro caso esa true
          if(newrows.affectedRows === 0) result = false;
          else result=true;

        })
        
        //si existe un error, este será el resultado
        .catch((error) => {
          result=error;
        });
      };
    };  
  };

  //retorno del resultado
  console.log(`resultado de registro: ${result}`);
  return result;
}