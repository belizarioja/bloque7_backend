const express = require("express");
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.post(config.servidor + '/listarproductos', function (req, res) {
    const { categoria } = req.body;
    const sql = "select a.IdArticulo, a.Articulo, a.Precio, b.EXISCAJAS from rcatalogo a, rexistencias b where a.IdArticulo = b.IDARTICULO and a.IdAgrupab = ?";
    conexion2.query(sql, [categoria], function (err, rows) {
        if(!err) {
            res.send(rows);
        } else {
            res.json({ 
                message: "Error listando productos",
                resp: err,
                status: 500
            });
        }
    })    
});
module.exports = router;
