const express = require("express");
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.post(config.servidor + '/listarproductos', function (req, res) {
    const { categoria } = req.body;    
    let sql = "select a.ARTV_IDARTICULO as id, a.ARTV_DESCART as nombre, a.ARTN_PRECIOCAM as precio, b.EXDEV_UNIDADES as disponible, "
    sql += " a.ARTN_UNIXCAJA as unixcaja, a.ARTV_DESCART as nombre, a.ARTN_PRECIOCAM as precio, b.EXDEV_UNIDADES as unidades, c.MARV_NOMBRE as marca, "
    sql += " a.ARTN_COSTOACTU as costoactu, a.ARTN_PORCIVA as porciva, a.ARTN_PRECIOCAJ as preciocaj, a.ARTN_PORKILOS as porkilos"
    const from = " from tarticulos a, texisdepo b, tmarca c "
    let where = " where a.ARTV_IDARTICULO = b.EXDEV_IDARTICULO and a.ARTV_IDMARCA = c.MARV_IDMARCA and b.EXDEV_UNIDADES > 0 ";
    if (categoria) {
        where += " and a.ARTV_IDAGRUPAA = " + categoria
    }
    conexion2.query(sql + from + where, function (err, rows) {
        if(!err) {
            res.send(rows)
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
