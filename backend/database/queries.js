const db = require('./config');

const getTables = (result) => {
 db.query(`show tables;`, (err, results) => {
  if (err) {
   console.log(err);
   result(err, null);
  } else {
   result(null,results);
  }
 });
}

module.exports = {
 getTables,
}