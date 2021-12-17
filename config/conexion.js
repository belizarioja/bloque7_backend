var mysql = require('mysql')
const config = require("./general")

var pool  = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database,
  multipleStatements: true
});
pool.connect(function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log(config.message);
    }
  });
module.exports = pool;