const db = require('./config');

//función asíncrona para desplegar todas las preguntas de un usuario
module.exports = async function mostrar_preguntas_usuario (data) {

    //declaración de variable result que será el retorno
    let result;

    //se ejecuta la query para obtener todas las preguntass
    await db.promise().query(`SELECT questions.id,questions.question,questions.description,questions.votes,questions.state 
                            FROM questions,users WHERE questions.email_user=? AND questions.email_user=users.email`, [data.email])
    .then( ([rows,fields]) => {

        //si el resultado es 0 entonces no hay cursos, en otro caso se retornan
        if(rows.length === 0) result = false;
        else{
            result = rows;

            for(let row of rows) {
                console.log(row);
            }
        }
    })
    
    //si ocurre un error, el resultado será el error
    .catch((error) => {
        result = error;
    })

    //acuso de resultado de la operación y retorno del resultado
    console.log(result);
    return result;
}