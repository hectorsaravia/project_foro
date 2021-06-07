//Requerimiento de ExpressJS. No pasar a ES6
const express = require('express');

//Se define app como la variable de ExpressJS
const app = express();

//Uso del puerto 3000
const port = 3000;

//Se indica que se aceptan JSON y x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res) => {
 res.json({'message': 'ok'})
});

app.listen(port, () => {
 console.log(`Server en http://localhost:${port}`)
});
