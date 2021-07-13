const db = require('./config');
const mostrar_cursos_usuario = require('./mostrar_cursos_usuario');

//función asíncrona para desplegar todas las preguntas de la facultad
module.exports = async function mostrar_preguntas_facultad (data) {

    //declaración de variable result que será el retorno
    let result;

    let rows = await mostrar_cursos_usuario(data);

    if (rows.length === 0) result = false;

    else {

        [rows,fields] = await db.promise().query(`SELECT career.id_school FROM courses,career 
                                                WHERE courses.id_career=career.id AND courses.id=?;`,
                                                [rows[0].id_courses]);

        //se ejecuta la query para obtener todas las preguntass
        await db.promise().query(`SELECT questions.id,questions.question,questions.description,questions.votes,questions.state FROM questions,courses,career,school 
                                WHERE school.id=career.id_school AND career.id=courses.id_career AND questions.id_courses=courses.id AND school.id=?;`, 
                                [rows[0].id_school])
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

    }


    //acuso de resultado de la operación y retorno del resultado
    console.log(result);
    return result;
}