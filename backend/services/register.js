const express = require('express');
const router = express.Router();
const queries = require('../database/queries');

router.post('/', (req, res) => {
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

module.exports = router;