const express = require("express");
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.post(config.servidor + '/listarproductos', function (req, res) {
    // const { categoria } = req.body;    
    let sql = "SELECT a.ARTV_IDARTICULO as id, a.ARTV_DESCART as nombre, a.ARTN_PRECIOCAM as precio, b.EXDEV_UNIDADES as disponible, "
    sql += " a.ARTN_UNIXCAJA as unixcaja, a.ARTV_DESCART as nombre, a.ARTN_PRECIOCAM as precio, "
    sql += " a.ARTN_COSTOACTU as costoactu, a.ARTN_PORCIVA as porciva, a.ARTN_PRECIOCAJ as preciocaj, a.ARTN_PORKILOS as porkilos "
    sql += ", d.IMGV_IDARTICULO as imagen "
    // sql += ", d.IMGV_IMAGEN1 as imagen "
    const from = " FROM tarticulos a "
    let where = " LEFT JOIN texisdepo b ON a.ARTV_IDARTICULO = b.EXDEV_IDARTICULO ";
    // where += " LEFT JOIN tmarca c ON a.ARTV_IDMARCA = c.MARV_IDMARCA ";
    where += " LEFT JOIN tartimagen d ON a.ARTV_IDARTICULO = d.IMGV_IDARTICULO ";
    where += " WHERE b.EXDEV_UNIDADES > 0 ";
    const order = " ORDER BY 2 ASC ";
    // const limit = " LIMIT 50 ";
    // where a.ARTV_IDARTICULO = b.EXDEV_IDARTICULO and a.ARTV_IDMARCA = c.MARV_IDMARCA and b.EXDEV_UNIDADES > 0 ";
    /* if (categoria) {
        where += " and a.ARTV_IDAGRUPAA = " + categoria
    } */
    conexion2.query(sql + from + where + order, function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.json({
                message: "Error listando productos " + err,
                resp: err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/getimagenproducto', function (req, res) {
    const { idproducto } = req.body;
    const sql = "SELECT IMGV_IMAGEN1 as imagen "
    const from = " FROM tartimagen "
    const where = " WHERE IMGV_IDARTICULO = '" + idproducto + "'";
    conexion2.query(sql + from + where, function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.json({
                message: "Error obteniendo imagen de productos " + err,
                resp: err,
                status: 500
            });
        }
    })
});
module.exports = router;
