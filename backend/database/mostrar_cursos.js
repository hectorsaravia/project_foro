const db = require('./config');

//función asíncrona para mostrar los cursos
module.exports = async function mostrar_cursos (data) {
 
    //variable de resultado que será el retorno
    let result;

    //query que realizará la búsqueda de los cursos en la carrera
    await db.promise().query(`SELECT id,name FROM courses WHERE id_career = ?;`,
    [data.id_career]) 
    .then( ([rows,fields]) => {
        
        //si no hay cursos, se retorna un false, en otro caso se realiza el retorno
        if (rows.lenght === 0) result = false;
        else {
            result = rows;

            for (let row of rows) {
                console.log(row);    
            }
        };
    
    })

    //en caso de ocurrir un error, este será el retorno
    .catch((error) => {
        result = error;
    })

    console.log(`cursos obtenidos: ${result}`)
    return result;
}