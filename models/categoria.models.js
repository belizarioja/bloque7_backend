const express = require("express");
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.get(config.servidor + '/listarcategorias', function (req, res) {
    const sql = "select * from tagrupab ";
    conexion2.query(sql, function (err, rows) {
        if(!err) {
            res.send(rows);
        } else {
            res.json({ 
                message: "Error listando grupos",
                resp: err,
                status: 500
            });
        }
    })    
});
module.exports = router;
