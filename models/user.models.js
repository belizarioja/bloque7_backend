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
            if (!err) {
                if (rows.length > 0) {
                    const sql2 = "select a.id, a.nombre, a.usuario, a.idrol, a.idsucursal, a.status, b.rol, a.fe_ult_acceso, a.fe_ult_get, a.uuid "
                    const from2 = "from usuarios a, roles b "
                    const where2 = "where a.usuario ='" + usuario + "' and a.clave = '" + clave + "' and a.idrol = b.idROL";
                    const resp2 = conexion.query(sql2 + from2 + where2, function (err, rows) {
                        if (!err) {
                            // console.log(rows[0].uuid)
                            const data = rows
                            if (rows[0].uuid) {
                                if (rows[0].uuid === uuid) {
                                    const update1 = "update usuarios set fe_ult_acceso = ? where usuario = ? ";
                                    conexion.query(update1, [fe_ult_acceso, usuario], function (err) {
                                        if (!err) {
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
                                    if (rows.length > 0) {
                                        res.json({
                                            message: "Ya este dispositivo está usado por otra cuenta",
                                            status: 500
                                        });
                                    } else {
                                        const update2 = "update usuarios set fe_ult_acceso = ?, uuid = ? where usuario = ? ";
                                        conexion.query(update2, [fe_ult_acceso, uuid, usuario], function (err) {
                                            if (!err) {
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
                                message: "Error al Acceso 1 : " + err,
                                status: 500
                            });
                        }
                    });
                } else {
                    const sql3 = "select VENDV_NOMBRE, VENDV_IDSUCURSAL from tvendedores where VENDV_IDVENDEDOR ='" + usuario + "'";
                    const resp3 = conexion2.query(sql3, function (err, rows) {
                        // console.log("rows 2")
                        if (rows.length > 0) {
                            const idsucursal = rows[0].VENDV_IDSUCURSAL
                            const nombre = rows[0].VENDV_NOMBRE
                            const sql4 = "insert into usuarios (usuario, clave, nombre, idsucursal, idrol, fe_ult_acceso, uuid, status) "
                            const values = " values ( ?, ?, ?, ?, ?, ?, ?, ?)"
                            conexion.query(sql4 + values, [usuario, usuario, nombre, idsucursal, 3, fe_ult_acceso, uuid, 1], function (err, rows) {
                                if (!err) {
                                    // console.log("Insertando ", rows.insertId)
                                    const arreglo = []
                                    const obj = {}
                                    obj.id = rows.insertId
                                    obj.idrol = 3
                                    obj.idsucursal = idsucursal
                                    obj.nombre = nombre
                                    obj.rol = "Vendedor"
                                    obj.usuario = usuario
                                    obj.status = 1
                                    obj.fe_ult_acceso = fe_ult_acceso
                                    obj.fe_ult_get = null
                                    obj.uuid = uuid
                                    arreglo.push(obj)
                                    res.json(arreglo)
                                } else {
                                    res.json({
                                        message: "Error al Acceso 2 : " + err,
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
                    message: "Error al Acceso 3 : " + err,
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
            if (!err) {
                if (rows.length > 0) {
                    const update = "update usuarios set clave = ? ";
                    const where = " where usuario = ? ";
                    conexion.query(update + where, [nuevaclave, usuario], function (err) {
                        if (!err) {
                            res.status(200).send("Clave de usuario, actualizado")
                        } else {
                            res.json({
                                message: "Error ACTUALIZANDO CLAVE : " + err,
                                status: 500
                            });
                        }
                    });
                } else {
                    res.json(rows)
                }
            } else {
                res.json({
                    message: "Error CONSULTANDO PARA CAMBIAR CLAVE : " + err,
                    status: 500
                });
            }
        })
    }
});
router.post(config.servidor + '/addUser', function (req, res) {
    const { usuario, nombre } = req.body;
    const idsucursal = 'S00001'
    const sql = "insert into usuarios (usuario, clave, nombre, idsucursal, idrol, status) "
    const values = " values ( ?, ?, ?, ?, ?, ?)"
    conexion.query(sql + values, [usuario, usuario, nombre, idsucursal, 4, 1], function (err, rows) {
        if (!err) {
            // console.log("Insertando ", rows.insertId)
            const arreglo = []
            const obj = {}
            obj.id = rows.insertId
            obj.idrol = 4
            obj.idsucursal = idsucursal
            obj.nombre = nombre
            obj.rol = "Cliente"
            obj.usuario = usuario
            obj.status = 1
            obj.fe_ult_acceso = null
            obj.fe_ult_get = null
            obj.uuid = null
            arreglo.push(obj)
            res.json(arreglo)
        } else {
            res.json({
                message: "Error insertando usuario cliente : " + err,
                status: 500
            });
        }
    });

});
router.get(config.servidor + '/usuarios', function (req, res) {
    const sql = "select * from usuarios WHERE usuario != 'soporte'";
    const resp = conexion.query(sql, function (err, rows) {
        if (!err) {
            res.json(rows);
        } else {
            res.json({
                message: "Error al consultar para listar usuario : " + err,
                status: 500
            });
        }
    })

});
router.post(config.servidor + '/hideShowUsuarios', function (req, res) {
    const { val, id } = req.body;
    const update = "update usuarios set status = ? ";
    const where = " where id = ? ";
    conexion.query(update + where, [val, id], function (err) {
        if (!err) {
            res.status(200).send("Status de usuario, actualizado")
        } else {
            res.json({
                message: "Error habilitando o deshabilitando usuario : " + err,
                status: 500
            });
        }
    });
});
router.post(config.servidor + '/updateFechaUltGet', function (req, res) {
    const { id } = req.body;
    const fe_ult_get = moment().format('YYYY-MM-DD HH:mm:ss')
    const update = "update usuarios set fe_ult_get = ? ";
    const where = " where id = ? ";
    // console.log(update + where)
    conexion.query(update + where, [fe_ult_get, id], function (err) {
        if (!err) {
            res.status(200).send("Fecha ult sincronizado de usuario, actualizado")
        } else {
            res.json({
                message: "Error actualizando fecha ultimo sincronizado: " + err,
                status: 500
            });
        }
    });
});

router.post(config.servidor + '/resetDevice', function (req, res) {
    const { id } = req.body;
    const update = "update usuarios set uuid = NULL ";
    const where = " where id = ? ";
    conexion.query(update + where, [id], function (err) {
        if (!err) {
            res.status(200).send("UUID de usuario, reseteado")
        } else {
            res.json({
                message: "Error reseteando UUID de usuario: " + err,
                status: 500
            });
        }
    });
});

module.exports = router;
