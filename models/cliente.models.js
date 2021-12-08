const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();
const moment = require('moment')

router.get(config.servidor + '/listar', function (req, res) {
    const sql = "select * from tclientesa ";
    const orderby =" order by 3 asc "
    const limit =" limit 50 "
    conexion2.query(sql + orderby + limit, function (err, rows) {
        if(!err) {
            res.send(rows);
        } else {
            res.json({ 
                message: "Error listando clientes",
                resp: err,
                status: 500
            });
        }
    })    
});
router.post(config.servidor + '/setupcarrito', async function (req, res) {
    const { idusuario, idcliente, nombrecliente, rifcliente } = req.body;
    const fecha = moment().format('YYYY-MM-DD HH:mm:ss')            
    const sql = "select * from holds where idusuario = " + idusuario;
    conexion.query(sql, async function (err, rows) {
        if(!err) {
            // console.log(rows)
            // console.log(rows.length)
            if( rows.length === 0 ) {
                const select = "insert into holds (idusuario, fecha, idcliente, nombrecliente, rifcliente) ";
                const values = " values ( ?, ?, ?, ?, ?)";
                console.log(select + values)
                await conexion.query(select + values, [idusuario , fecha, idcliente, nombrecliente, rifcliente], function (err, rows) {
                    if(!err) {
                        // console.log(rows)
                        res.json({ 
                            message: "Holds creado",
                            status: 200
                        });
                    } else {
                        res.json({ 
                            message: "Error creando holds",
                            resp: err,
                            status: 500
                        });
                    }
                })
            } else {
                const update = "update holds set idcliente = ?, fecha = ?, nombrecliente = ? , rifcliente = ? ";
                const where = " where idusuario = ?";
                // console.log(update + where + nombrecliente)
                await conexion.query(update + where, [idcliente , fecha, nombrecliente, rifcliente, idusuario], function (err, rows) {
                    if(!err) {
                        res.json({ 
                            message: "Holds Actualizado",
                            status: 200
                        });                        
                    } else {
                        console.log(err)
                        res.json({ 
                            message: "Error actualizando holds",
                            resp: err,
                            status: 500
                        });
                    }
                });
            }
        } else {
            res.json({ 
                message: "Error consultando Holds",
                resp: err,
                status: 500
            });
        }
    })    
});
router.post(config.servidor + '/getholds', function (req, res) {
    const { idusuario } = req.body;
    const sql = "select * from holds where idusuario = ?";
    conexion.query(sql, [idusuario], function (err, rows) {
        if(!err) {
            res.send(rows);
        } else {
            res.json({ 
                message: "Error listando clientes",
                resp: err,
                status: 500
            });
        }
    })    
});

module.exports = router;
