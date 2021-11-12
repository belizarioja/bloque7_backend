const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();
const moment = require('moment')

router.get(config.servidor + '/listarVendedores', function (req, res) {
    const sql = "select * from tvendedores ";
    const orderby =" order by 3 asc "
    const limit =" limit 50 "
    conexion2.query(sql + orderby + limit, function (err, rows) {
        if(!err) {
            res.send(rows);
        } else {
            res.json({ 
                message: "Error listando vendedores",
                resp: err,
                status: 500
            });
        }
    })    
});

module.exports = router;
