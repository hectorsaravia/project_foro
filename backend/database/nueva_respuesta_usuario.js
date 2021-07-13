const db = require('./config');

//función para ingresar nueva respuesta
module.exports = async function nueva_respuesta (data) {
 
    //declaración de variable result que será el retorno
    let result;

    //se ejecuta la query para ingresar una nueva respuesta
    await db.promise().query(`INSERT INTO answers(email_user,id_question,answer) VALUES(?,?,?);`,
    [data.email, data.id_question, data.answer])
    .then( ([rows,fields])  => {

        //si el resultado es 0 entonces no se ingresó la respuesta, en otro caso se retorna true
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