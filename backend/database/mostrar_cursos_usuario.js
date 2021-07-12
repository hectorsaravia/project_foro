const db = require('./config');

//función para desplegar todos los cursos de un usuario
module.exports = async function mostrar_cursos_usuario (data) {
 
    //declaración de variable result que será el retorno
    let result;

    //se ejecuta la query para obtener todas los cursos
    await db.promise().query(`SELECT id.courses,courses.name FROM user_courses,courses
                            WHERE user_courses.email_user=? AND courses.id=user_courses.id_courses;`,
                            [data.email])
    .then( ([rows,fields])  => {

        //si el resultado es 0 entonces no hay cursos, en otro caso se retornan
        if(rows.lenght === 0) return false;
        else {
            result = rows;
            for (let row of rows) {
                console.log(row.name);
            }
        };
 
    })
 
    //si ocurre un error, el resultado será el error
    .catch( (error) => {
        result = error;
    })

    //acuso de resultado de la operación y retorno del resultado
    console.log(`cursos a mostrar: ${result}`);
    return result;
}