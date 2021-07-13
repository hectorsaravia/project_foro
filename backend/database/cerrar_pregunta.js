const db = require('./config');

//función para poder cerrar una pregunta
module.exports = async function cerrar_pregunta (data) {
 
    //declaración de variable result que será el retorno
    let result;

    //se ejecuta la query para marcar como cerrada la pregunta
    await db.promise().query(`UPDATE questions SET status=0 WHERE id=?;`,[data.id])
    .then( ([rows,fields])  => {

        //si el resultado es 0 entonces no se modificó el estado, en otro caso se retorna true
        if (rows.affectedRows === 1) result = true;
        else result = false;

    })

    //si ocurre un error, el resultado será el error
    .catch( (error) => {
        result = error;
    })


    //acuso de resultado de la operación y retorno del resultado
    console.log(`pregunta insertada: ${result}`);
    return result;

}