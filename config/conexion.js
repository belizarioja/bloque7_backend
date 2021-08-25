var mysql = require('mysql');

var pool  = mysql.createConnection({
    host     : 'localhost',
    user     : 'usuario',
    password : '*Loemy4200',
    database : 'bloque7_app',
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