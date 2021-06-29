//este archivo controla las rutas hacia distintas url
//por ejemplo, para '/' la ruta relativa completa es /api/
const express = require('express');
const router = express.Router();

const queries = require('./database/queries');

router.get('/', (req, res) => {
 queries.getTables((err, results) => {
  if (err) {
   res.send(err);
  } else {
   res.json(results);
  };
 });
});

router.post('/register', (req, res) => {
 const data = req.body;
 queries.register(data, (err, results) => {
  if (err) {
   res.send(err);
  } else {
   res.json(results);
   console.log(results);
  };
 });
});

router.post('/test', (req,res) => {
 const data = req.body;
 res.json( {'message': 'wena'} );
 console.log(data);
})

module.exports = router;