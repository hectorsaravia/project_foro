const db = require('./config');

//función asíncrona para mostrar carreras
module.exports = async function mostrar_carreras (data) {

    //declaración de variable result que será el retorno
    let result;

    //query que realiza la consulta de la búsqueda de la carrera
    await db.promise().query(`SELECT id,name FROM career WHERE id_school = ?;`,
    [data.id_school])
    .then( ([rows,fields]) => {
        
        //si no hay resultados, es falso, en otro caso se retornan las carreras
        if(rows.lenght === 0) result = false;
        else result=rows;

    //si ocurre un error, este será el resultado
    }).catch((error)=> {
        result=error;
    })

    //acuso de operación realizada y de retorno del resultado
    console.log(`carreras obtenidas: ${result}`);
    return result;
}