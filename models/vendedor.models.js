const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.get(config.servidor + '/listarVendedores', function (req, res) {
    let sql = "select a.VENDV_IDVENDEDOR as id, a.VENDV_NOMBRE as nombre, "
    sql += " ( select b.PEDID_EMISION from tpedven_enc b where a.VENDV_IDVENDEDOR = b.PEDIV_IDVENDEDOR order by b.PEDIV_NUMEDOCU desc limit 1 ) as fecha "
    sql += " from tvendedores a "
    const orderby = " order by 2 asc "
    const resp = conexion2.query(sql + orderby, function (err, rows) {
        if (!err) {
            /* let arreglo = []
            rows.forEach(function(dataElement){
                const obj = {}
                obj.id = dataElement.VENDV_IDVENDEDOR
                obj.nombre = dataElement.VENDV_NOMBRE
                arreglo.push(obj)
            }); */
            // console.log(arreglo)
            // console.log(rows)
            res.send(rows)
        } else {
            res.json({
                message: "Error listando vendedores",
                resp: err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/listarVendedorClientes', function (req, res) {
    const { idvendedor } = req.body;
    const sql = "select a.CLIEV_IDCLIENTE as idcliente, a.CLIEV_RIF as rifcliente, a.CLIEV_NOMBFISCAL as nombrecliente, b.PLANV_IDVENDEDOR, b.PLANV_IDCLIENTE "
    const from = " from tclientesa a, tplanrutas b";
    const where = " where a.CLIEV_IDCLIENTE=b.PLANV_IDCLIENTE and b.PLANV_IDVENDEDOR = '" + idvendedor + "'"
    const orderby = " order by 3 asc "
    const resp = conexion2.query(sql + from + where + orderby, function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.json({
                message: "Error listando Clientes del vendedor",
                resp: err,
                status: 500
            });
        }
    })
});

module.exports = router;
