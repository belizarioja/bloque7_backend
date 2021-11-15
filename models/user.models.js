const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router();

router.post(config.servidor + '/login', function (req, res) {
        const { usuario, clave } = req.body;
        if (usuario.length === 0 || clave.length === 0) {
            res.json({ 
                message: "Debe agregar usuario y clave",
                status: 400
            });
        } else {
            const sql = "select a.id, a.nombre, a.usuario, a.idrol, a.status, b.rol " 
            const from = "from usuarios a, roles b "
            const from = "where a.usuario ='"+usuario+"' and a.clave = '"+clave+"' and a.idrol = b.id";
            const resp = conexion.query(sql, function (err, rows) {
                if(!err) {
                    res.json(rows);
                } else {
                    res.json({ 
                        message: "Acceso NO válido",
                        resp: err,
                        status: 500
                    });
                }
            })
        }

});
router.get(config.servidor + '/usuarios', function (req, res) {
        const sql = "select * from usuarios";
        const resp = conexion.query(sql, function (err, rows) {
            if(!err) {
                res.json(rows);
            } else {
                res.json({ 
                    message: "Acceso NO válido",
                    resp: err,
                    status: 500
                });
            }
        })

});
router.post(config.servidor + '/vendedorUsuario', function (req, res) {
    const { id, nombre } = req.body;
    const sql = "select * from usuarios where usuario ='" + id +"'";
    const resp = conexion.query(sql, function (err, rows) {
        if(!err) {
            if(rows.length === 0) {
                const sql = "insert into usuarios (usuario, clave, nombre, idrol, status) "
                const values = " values ( ?, ?, ?, ?, ?)"
                conexion.query(sql + values, [id, id, nombre, 3, 0], function (err) {
                    if(!err) {
                        res.status(200).send("Vendedor agregado como usuario con éxito")
                    }
                });
            } else {
                res.status(200).send("Vendedor ya estaba agregado como usuario")
            }    
        }
    })   

});
module.exports = router;
