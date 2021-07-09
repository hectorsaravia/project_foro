//Requerimientos para backend. No pasar a ES6
const express = require('express');
const cors = require('cors');

//Importar rutas
const routes = require('./routes');

//Se define app como la variable de ExpressJS
const app = express();

//Uso de cors
app.use(cors());

//Uso del puerto 3000
const port = 3000;

//Se indica que se aceptan JSON y x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', routes);

app.get('/', (req,res) => {
 res.json({'message': 'ok'})
});

//manejo de error 400
app.use(function (req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
});

//manejo de error 500
if (app.get('env') === 'development') {
 app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
   message: err.message,
   error: err
  });
 });
}

//mensaje de escucha en el puerto 3000
app.listen(port, () => {
 console.log(`Server en http://localhost:${port}`)
});
