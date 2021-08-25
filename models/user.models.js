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
            const sql = "select id, nombre from usuarios where usuario ='"+usuario+"' and clave = '"+clave+"'";
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

})
module.exports = router;
