var mysql = require('mysql');

var pool  = mysql.createConnection({
    host     : 'localhost',
    user     : 'usuario',
    password : '1234',
    database : 'ejdevelo_appbloque7',
    multipleStatements: true
});
pool.connect(function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log('db is connected');
    }
  });
module.exports = pool;