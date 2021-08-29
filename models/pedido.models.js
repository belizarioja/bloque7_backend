const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router();

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
    const { idhold, idproducto, nombreproducto, precio, pieza, subtotal } = req.body;
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

module.exports = router;
