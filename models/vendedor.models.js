const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.get(config.servidor + '/listarVendedores', function (req, res) {
    let sql = "select a.VENDV_IDVENDEDOR as id, a.VENDV_NOMBRE as nombre, "
    sql += " ( select b.PEDID_EMISION from tpedven_enc b where a.VENDV_IDVENDEDOR = b.PEDIV_IDVENDEDOR order by b.PEDIV_NUMEDOCU desc limit 1 ) as fecha "
    sql += " from tvendedores a "
    const orderby =" order by 2 asc "
    const resp = conexion2.query(sql + orderby, function (err, rows) {
        if(!err) {
            /* let arreglo = []
            rows.forEach(function(dataElement){
                const obj = {}
                obj.id = dataElement.VENDV_IDVENDEDOR
                obj.nombre = dataElement.VENDV_NOMBRE
                arreglo.push(obj)
            }); */
            // console.log(arreglo)
            console.log(rows)
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
    const where =" where a.CLIEV_IDCLIENTE=b.PLANV_IDCLIENTE and b.PLANV_IDVENDEDOR = '" + idvendedor +"'"
    const orderby =" order by 3 asc "
    const resp = conexion2.query(sql + from + where + orderby, function (err, rows) {
        if(!err) {            
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
/* router.post(config.servidor + '/agregarClienteVendedor', function (req, res) {
    const { idvendedor, nombrevendedor, idcliente, nombrecliente, rifcliente } = req.body;
    const sql = "select * from usuarios where usuario ='" + idvendedor +"'";
    const resp = conexion.query(sql, function (err, rows) {
        if(!err) {
            console.log(rows.length)
            if(rows.length === 0) {
                const sql = "insert into usuarios (usuario, clave, nombre, idrol, status) "
                const values = " values ( ?, ?, ?, ?, ?)"
                conexion.query(sql + values, [idvendedor, idvendedor, nombrevendedor, 3, 0]);
            }    
        }
    });
    const sql2 = "select * from vendedor_cliente where idvendedor = '" + idvendedor + "' and idcliente = '" + idcliente + "'";
    conexion.query(sql2, function (err, rows) {
        if(!err) {       
            if(rows.length === 0) {
                // console.log(obj.nombre)
                const sql3 = "insert into vendedor_cliente (idvendedor, idcliente, nombrecliente, rifcliente) "
                const values = " values ( ?, ?, ?, ?)"
                conexion.query(sql3 + values, [idvendedor, idcliente, nombrecliente, rifcliente], function (err) {
                    if(!err) {
                        res.status(200).send("Cliente asignado a Vendedor correctamente")                      
                    }
                });
            }
        } else {
            res.json({ 
                message: "Error asignando cliente a vendedor",
                resp: err,
                status: 500
            });
        }
    });
});
router.post(config.servidor + '/eliminarClienteVendedor', function (req, res) {
    const { id } = req.body;
    const sql = "delete from vendedor_cliente where id = " + id;
    conexion.query(sql, function (err) {
        if(!err) {       
            res.status(200).send("Cliente eliminado del Vendedor correctamente")            
        } else {
            res.json({ 
                message: "Error eliminando cliente a vendedor",
                resp: err,
                status: 500
            });
        }
    })    
});*/

module.exports = router;
