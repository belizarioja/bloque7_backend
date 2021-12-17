var mysql = require('mysql')
const config = require("./general")

var pool  = mysql.createConnection({
  host     : config.host2,
  user     : config.user2,
  password : config.password2,
  database : config.database2,
  multipleStatements: true
});
pool.connect(function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log(config.message2);
    }
  });
module.exports = pool;