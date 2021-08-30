const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router();
const moment = require('moment')

router.post(config.servidor + '/setitemcarrito', async function (req, res) {
    const { idhold, idproducto, nombreproducto, precio, cantidad, pieza, subtotal } = req.body;
    // console.log ( idhold, idproducto, nombreproducto, precio, cantidad, pieza, subtotal )
    const select = "insert into hold_items (idhold, idproducto, nombreproducto, precio, cantidad, pieza, subtotal) ";
    const values = " values ( ?, ?, ?, ?, ?, ?, ?)";
    // console.log(select + values)
    await conexion.query(select + values, [idhold, idproducto, nombreproducto, precio, cantidad, pieza, subtotal], function (err, rows) {
        if(!err) {
            console.log(rows)
            res.json({ 
                message: "Item de Holds creado",
                status: 200
            });
        } else {
            res.json({ 
                message: "Error creando Item holds",
                resp: err,
                status: 500
            });
        }
    })  
});
router.post(config.servidor + '/getitemcarrito', async function (req, res) {
    const { idhold } = req.body;
    const sql = "select * from hold_items where idhold = ?";
    await conexion.query(sql, [idhold], function (err, rows) {
        if(!err) {            
            res.send(rows);
        } else {
            res.json({ 
                message: "Error consultando Item holds",
                resp: err,
                status: 500
            });
        }
    })  
});
router.post(config.servidor + '/setpedido', async function (req, res) {
    const { idusuario, idcliente, nombrecliente, total } = req.body;
    const fecha = moment().format('YYYY-MM-DD HH:mm:ss')            
    const select = "insert into pedidos (idusuario, fecha, idcliente, nombrecliente, total) ";
    const values = " values ( ?, ?, ?, ?, ?)";
    console.log(select + values)
    await conexion.query(select + values, [idusuario , fecha, idcliente, nombrecliente, total], function (err, rows) {
        if(!err) {
            // console.log(rows)
            res.json(rows);
        } else {
            res.json({ 
                message: "Error creando pedido",
                    resp: err,
                    status: 500
            });
        }
    })    
});
router.post(config.servidor + '/setitemspedido', async function (req, res) {
    const { idpedido, idproducto, nombreproducto, precio, cantidad, pieza, subtotal } = req.body;
    const select = "insert into pedido_items (idpedido, idproducto, nombreproducto, precio, cantidad, pieza, subtotal) ";
    const values = " values ( ?, ?, ?, ?, ?, ?, ?)";
    await conexion.query(select + values, [idpedido, idproducto, nombreproducto, precio, cantidad, pieza, subtotal], function (err, rows) {
        if(!err) {            
            res.send(rows);
        } else {
            res.json({ 
                message: "Error consultando Item holds",
                resp: err,
                status: 500
            });
        }
    })  
});
router.post(config.servidor + '/deletecarrito', async function (req, res) {
    const { idhold } = req.body;
    const sql = "delete FROM hold_items where idhold = ? ";
    await conexion.query(sql, [idhold], async function (err, rows) {
        if(!err) {            
            const sql = "delete FROM holds where id = ? ";
            await conexion.query(sql, [idhold], function (err, rows) {
                if(!err) {    
                    res.send(rows);
                } else {
                    res.json({ 
                        message: "Error borrando hold",
                        resp: err,
                        status: 500
                    });
                }
            });
        } else {
            res.json({ 
                message: "Error borrando Item holds",
                resp: err,
                status: 500
            });
        }
    })  
});

module.exports = router;
