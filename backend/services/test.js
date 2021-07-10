const express = require('express');
const router = express.Router();
const queries = require('../database/queries');

router.post('/', (req,res) => {
 const data = req.body;
 queries.login(data, (err,results) => {
  if (err) {
   res.send(err);
  } else {
   res.json(results);
   console.log(results);
  };
 });
});

router.get('/', (req,res) => {
 res.json({'message': 'fokiu'});
});

module.exports = router;
