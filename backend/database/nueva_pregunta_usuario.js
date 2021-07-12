const db = require('./config');

//función para ingresar nueva pregunta
module.exports = async function nueva_pregunta (data) {
 
    //declaración de variable result que será el retorno
    let result;

    //se ejecuta la query para ingresar una nueva pregunta
    await db.promise().query(`INSERT INTO questions(email_user,id_courses,question,description)
                            VALUES(?,?,?,?);`, [data.email, data.id_courses, data.question, data.description])
    .then( ([rows,fields])  => {

        //si el resultado es 0 entonces no hay facultades, en otro caso se retornan
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