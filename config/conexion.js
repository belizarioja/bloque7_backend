var mysql = require('mysql');
/* var pool  = mysql.createConnection({
  host     : 'localhost',
  user     : 'usuario',
  password : '*Loemy4200',
  database : 'bloque7_app',
  multipleStatements: true
});*/
var pool  = mysql.createConnection({
  host     : 'www.ejdevelop.com',
  // host     : 'localhost', 
  user     : 'ejdevelo_bloque7',
  password : '*bloque7*',
  database : 'ejdevelo_appbloque7',
  multipleStatements: true
});
pool.connect(function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log('BD App pedidos está conectada');
    }
  });
module.exports = pool;