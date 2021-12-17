const express = require('express');
const cors = require('cors');
const app = express();
const config = require("./config/general")

var corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const usermodel = require("./models/user.models");
const clientemodel = require("./models/cliente.models");
const categoriamodel = require("./models/categoria.models");
const productomodel = require("./models/producto.models");
const pedidomodel = require("./models/pedido.models");
const vendedormodel = require("./models/vendedor.models");

app.use(usermodel);
app.use(clientemodel);
app.use(categoriamodel);
app.use(productomodel);
app.use(pedidomodel);
app.use(vendedormodel);
app.get(config.servidor + '/', function (req, res) {
  res.json({
      message: 'Conexion válida.',
      status: 200
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
