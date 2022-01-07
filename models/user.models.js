const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();
const moment = require('moment')

router.post(config.servidor + '/login', function (req, res) {
    const { usuario, clave, uuid } = req.body;
    if (usuario.length === 0 || clave.length === 0) {
        res.json({ 
            message: "Debe agregar usuario y clave",
            status: 400
        });
    } else {
        const fe_ult_acceso = moment().format('YYYY-MM-DD HH:mm:ss')
        const sql1 = "select * from usuarios where usuario ='" + usuario + "'"
        const resp1 = conexion.query(sql1, function (err, rows) {
            if(!err) {
                if(rows.length > 0) {
                    const sql2 = "select a.id, a.nombre, a.usuario, a.idrol, a.idsucursal, a.status, b.rol, a.fe_ult_acceso, a.uuid " 
                    const from2 = "from usuarios a, roles b "
                    const where2 = "where a.usuario ='" + usuario + "' and a.clave = '" + clave + "' and a.idrol = b.idROL";
                    const resp2 = conexion.query(sql2 + from2 + where2, function (err, rows) {
                        if(!err) {
                            // console.log(rows[0].uuid)
                            const data = rows
                            if (rows[0].uuid) {
                                if (rows[0].uuid === uuid) {
                                    const update1 = "update usuarios set fe_ult_acceso = ? where usuario = ? ";
                                    conexion.query(update1, [fe_ult_acceso, usuario], function (err) {
                                        if(!err) {
                                            res.json(data)
                                        } else {
                                            res.json({ 
                                                message: "Error actualizando fecha usuario : " + err,
                                                status: 500
                                            });                       
                                        }
                                    });
                                } else {
                                    res.json({ 
                                        message: "No está autorizado para abrir esta app en este dispositivo",
                                        status: 500
                                    })
                                }
                            } else {
                                const sqluuid = "select * from usuarios where uuid ='" + uuid + "'"
                                const respuuid = conexion.query(sqluuid, function (err, rows) {
                                    if(rows.length > 0) {
                                        res.json({ 
                                            message: "Ya este dispositivo está usado por otra cuenta",
                                            status: 500
                                        });
                                    } else {
                                        const update2 = "update usuarios set fe_ult_acceso = ?, uuid = ? where usuario = ? ";
                                        conexion.query(update2, [fe_ult_acceso, uuid, usuario], function (err) {
                                            if(!err) {
                                                res.json(data)
                                            } else {
                                                res.json({ 
                                                    message: "Error actualizando uuid y fecha usuario : " + err,
                                                    status: 500
                                                });                       
                                            }
                                        }); 
                                    }      
                                });                           
                            }                             
                        } else {
                            res.json({ 
                                message: "Error al Acceso : " + err,
                                status: 500
                            });
                        }
                    });
                } else {
                    const sql3 = "select VENDV_NOMBRE, VENDV_IDSUCURSAL from tvendedores where VENDV_IDVENDEDOR ='" + usuario + "'";
                    const resp3 = conexion2.query(sql3, function (err, rows) {
                        // console.log("rows 2")
                        if(rows.length > 0) {
                            const idsucursal = rows[0].VENDV_IDSUCURSAL
                            const nombre = rows[0].VENDV_NOMBRE
                            const sql4 = "insert into usuarios (usuario, clave, nombre, idsucursal, idrol, fe_ult_acceso, uuid, status) "
                            const values = " values ( ?, ?, ?, ?, ?, ?, ?, ?)"
                            conexion.query(sql4 + values, [usuario, usuario, nombre, idsucursal, 3, fe_ult_acceso, uuid, 1], function (err, rows) {
                                if(!err) {
                                    // console.log("Insertando ", rows.insertId)
                                    const arreglo = []
                                    const obj = {}
                                    obj.id = rows.insertId
                                    obj.idrol = 2
                                    obj.idsucursal = idsucursal
                                    obj.nombre = nombre
                                    obj.rol = "Vendedor"
                                    obj.usuario = usuario                                
                                    obj.status = 1         
                                    obj.fe_ult_acceso = fe_ult_acceso                                
                                    obj.uuid = uuid                       
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
router.post(config.servidor + '/cambiarclave', function (req, res) {
    const { usuario, claveactual, nuevaclave } = req.body;
    if (usuario.length === 0 || claveactual.length === 0 || nuevaclave.length === 0) {
        res.json({ 
            message: "Debe agregar todos los datos",
            status: 500
        });
    } else {
        const sql1 = "select * from usuarios where usuario ='" + usuario + "' and clave = '" + claveactual + "'"
        const resp1 = conexion.query(sql1, function (err, rows) {
            if(!err) {
                if(rows.length > 0) {
                    const update = "update usuarios set clave = ? ";
                    const where = " where usuario = ? ";
                    conexion.query(update + where, [nuevaclave, usuario], function (err) {
                        if(!err) {
                            res.status(200).send("Clave de usuario, actualizado")
                        } else {
                            res.json({ 
                                message: "Error actualizando usuario",
                                resp: err,
                                status: 500
                            });                       
                        }
                    });
                } else {
                    res.json(rows)                        
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
        const sql = "select * from usuarios WHERE usuario != 'soporte'";
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
router.post(config.servidor + '/hideShowUsuarios', function (req, res) {
    const { val, id } = req.body;
    const update = "update usuarios set status = ? ";
    const where = " where id = ? ";
    conexion.query(update + where, [val ,id], function (err) {
        if(!err) {
            res.status(200).send("Status de usuario, actualizado")
        } else {
            res.json({ 
                message: "Error actualizando usuario",
                resp: err,
                status: 500
            });
        }
    });
});

module.exports = router;
