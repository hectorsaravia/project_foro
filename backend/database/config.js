//este archivo controla la configuración de la base de datos
//que va a usar la api
const mysql = require('mysql2');

const db = mysql.createConnection ({
 host: 'localhost',
 user: 'root',
 password: '12345',
 database: 'project_foro'
});

module.exports = db;