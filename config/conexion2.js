var mysql = require('mysql');
/* var pool  = mysql.createConnection({
  host     : 'federcont.sytes.net',
  // host     : 'localhost',
  user     : 'root',
  password : 'SEUZ4',
  database : 'seuz0000177',
  multipleStatements: true
}); */ 
var pool  = mysql.createConnection({
  host     : 'www.ejdevelop.com',
  user     : 'ejdevelo_bloque7',
  password : '*bloque7*',
  database : 'ejdevelo_bloque7',
  multipleStatements: true
});
pool.connect(function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log('BD sistema SEUZ is connected');
    }
  });
module.exports = pool;