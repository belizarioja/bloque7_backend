const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
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
            const sql1 = "select * from usuarios where usuario ='" + usuario + "'"
            const sql2 = "select a.id, a.nombre, a.usuario, a.idrol, a.idsucursal, a.status, b.rol " 
            const from2 = "from usuarios a, roles b "
            const where2 = "where a.usuario ='" + usuario + "' and a.clave = '" + clave + "' and a.idrol = b.idROL";
            const resp1 = conexion.query(sql1, function (err, rows) {
                if(!err) {
                    if(rows.length > 0) {
                        const resp2 = conexion.query(sql2 + from2 + where2, function (err, rows) {
                            if(!err) {
                                res.json(rows)
                            } else {
                                // console.log(err)
                                res.json({ 
                                    message: "Error al Acceso",
                                    resp: err,
                                    status: 500
                                });
                            }
                        });
                    }
                    else {
                        const sql3 = "select VENDV_NOMBRE, VENDV_IDSUCURSAL from tvendedores where VENDV_IDVENDEDOR ='" + usuario + "'";
                        const resp3 = conexion2.query(sql3, function (err, rows) {
                            // console.log("rows 2")
                            if(rows.length > 0) {                               
                                const idsucursal = rows[0].VENDV_IDSUCURSAL
                                const nombre = rows[0].VENDV_NOMBRE
                                const sql4 = "insert into usuarios (usuario, clave, nombre, idsucursal, idrol, status) "
                                const values = " values ( ?, ?, ?, ?, ?, ?)"
                                conexion.query(sql4 + values, [usuario, usuario, nombre, idsucursal, 3, 1], function (err, rows) {
                                    if(!err) {
                                        // console.log("Insertando ", rows.insertId)
                                        const arreglo = []
                                        const obj = {}
                                        obj.id = rows.insertId
                                        obj.idrol = 3
                                        obj.idsucursal = idsucursal
                                        obj.nombre = nombre
                                        obj.rol = "Vendedor"
                                        obj.usuario = usuario                                
                                        arreglo.push(obj)
                                        res.json(arreglo)
                                    } else {
                                        res.json({ 
                                            message: "Error al Acceso",
                                            resp: err,
                                            status: 500
                                        });
                                    }
                                });                               
                            } else {
                                res.json(rows)
                            }                            
                        });
                    }                    
                } else {
                    res.json({ 
                        message: "Error al Acceso",
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
