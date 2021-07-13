const db = require('./config');

//función para poder votar una respuesta
module.exports = async function votar_respuesta (data) {
 
    //declaración de variable result que será el retorno
    let result;

    if (data.vote === 1) {

        //se ejecuta la query para ingresar un nuevo voto
        await db.promise().query(`UPDATE answers SET votes=votes+1 WHERE id=?;`,[data.id])
        .then( ([rows,fields])  => {

            //si el resultado es 0 entonces no se realizó la operación, en otro caso se retorna true
            if (rows.affectedRows === 1) result = true;
            else result = false;
    
        })
    
        //si ocurre un error, el resultado será el error
        .catch( (error) => {
            result = error;
        })
        
    } else if (data.vote === -1) {

        //se ejecuta la query para ingresar un nuevo voto
        await db.promise().query(`UPDATE answers SET votes=votes-1 WHERE id=?;`,[data.id])
        .then( ([rows,fields])  => {

            //si el resultado es 0 entonces no se realizó la operación, en otro caso se retorna true
            if (rows.affectedRows === 1) result = true;
            else result = false;
    
        })
    
        //si ocurre un error, el resultado será el error
        .catch( (error) => {
            result = error;
        })

    }

    else result=false;

    if (result = true) {
     
        await db.promise().query(`INSERT INTO answers_votes(email_user,id_answer) VALUES(?,?)`
        ,[data.email, data.id])
        .then( ([rows,fields])  => {

            //si el resultado es 0 entonces no se ingresó la respuesta, en otro caso se retorna true
            if (rows.affectedRows === 1) result = true;
            else result = false;
    
        })
    
        //si ocurre un error, el resultado será el error
        .catch( (error) => {
            result = error;
        })
    
    }

    //acuso de resultado de la operación y retorno del resultado
    console.log(`voto realizado: ${result}`);
    return result;

}