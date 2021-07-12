const db = require('./config');

//función asíncrona para desplegar todos los datos de una pregunta por id
module.exports = async function mostrar_preguntas_usuario (data) {

    //declaración de variable result que será el retorno
    let result;

    //se ejecuta la query para obtener todas las preguntas
    await db.promise().query(`SELECT * FROM questions WHERE id=?`, [data.id_question])
    .then( ([rows,fields]) => {

        //si el resultado es 0 entonces no hay preguntas, en otro caso se retornan
        if(rows.length === 0) result = false;
        else result = rows[0];
        
    })
    
    //si ocurre un error, el resultado será el error
    .catch((error) => {
        result = error;
    })

    //acuso de resultado de la operación y retorno del resultado
    console.log(result);
    return result;
}