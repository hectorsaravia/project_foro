//este archivo controla las rutas hacia distintas url
//por ejemplo, para '/' la ruta relativa completa es /api/
const express = require('express');
const router = express.Router();

const queries = require('./database/queries')

router.get('/', (req, res) => {
 queries.getTables((err, results) => {
  if (err) {
   res.send(err);
  } else {
   res.json(results);
  };
 });
});

module.exports = router;