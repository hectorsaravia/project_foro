const db = require('./config');

//función para desplegar las facultades
module.exports = async function mostrar_facultades () {
 
 //declaración de variable result que será el retorno
 let result;

 //se ejecuta la query para obtener todas las facultades
 db.promise().query(`SELECT id,name FROM school;`)
 .then( ([rows,fields])  => {

  //si el resultado es 0 entonces no hay facultades, en otro caso se retornan
  if(rows.lenght === 0) return false;
  else result = rows;
 
 })
 
 //si ocurre un error, el resultado será el error
 .catch( (error) => {
  result = error;
 })

 //acuso de resultado de la operación y retorno del resultado
 console.log(`facultados a mostrar: ${result}`);
 return result;
}