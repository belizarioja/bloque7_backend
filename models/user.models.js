const express = require("express");
const conexion = require("../config/conexion")
const router = express.Router();

router.post('/login', function (req, res) {
        const { usuario, clave } = req.body;
        if (usuario.length === 0 || clave.length === 0) {
            res.json({ 
                message: "Debe agregar usuario y clave",
                status: 400
            });
        } else {
            const sql = "select * from usuarios where usuario ='"+usuario+"' and clave = '"+clave+"'";
            // console.log(sql);
            const resp = conexion.query(sql, function (err, rows) {
                if(!err) {
                    res.json(rows);
                    // return rows; 
                } else {
                    console.log( err)
                    res.json({ 
                        message: "Acceso válido",
                        resp: err,
                        status: 500
                    });
                }
            })
        }

})
module.exports = router;
