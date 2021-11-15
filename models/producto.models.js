const express = require("express");
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.post(config.servidor + '/listarproductos', function (req, res) {
    const { categoria } = req.body;
    const sql = "select a.ARTV_IDARTICULO, a.ARTV_DESCART, a.ARTN_PRECIOCAM "
    const from = "from tarticulos a "
    const where = "where a.ARTV_IDARTICULO and a.ARTV_IDAGRUPAB = ?";
    conexion2.query(sql + from + where, [categoria], function (err, rows) {
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
