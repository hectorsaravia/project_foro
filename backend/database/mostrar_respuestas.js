const db = require('./config');

//función asíncrona para desplegar todos los datos de una pregunta por id
module.exports = async function mostrar_respuestas (data) {

    //declaración de variable result que será el retorno
    let result;

    //se ejecuta la query para obtener todas las preguntas
    await db.promise().query(`SELECT answers.answer,answers.votes,answers.email_user FROM answers,questions 
                            WHERE answers.id_question=questions.id AND questions.id=?;`, [data.id])
    .then( ([rows,fields]) => {

        //si el resultado es 0 entonces no hay preguntas, en otro caso se retornan
        if(rows.length === 0) result = false;
        else {
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