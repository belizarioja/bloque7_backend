const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const config = require("./config/general")

var corsOptions = {
  origin: '*'
};

app.use(fileUpload())
app.use(cors(corsOptions));
// parse requests of content-type - application/json
// app.use(express.json());
app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));
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
})
// app.use(express.static('imagenes'));

app.get('/files/:img', function (req, res) {
  const img = req.params.img
  // console.log(img)
  res.sendFile(__dirname + '/files/' + img, function (err) {
    if (err) {
      res.status(404).send(err)
    }
  })
});
app.post(config.servidor + '/upload', (req, res) => {
  const { nombreimagen } = req.body
  let EDFile = req.files.inputImg
  EDFile.name = nombreimagen + '.png'
  EDFile.mv(`./files/${EDFile.name}`, err => {
    if (err) {
      return res.status(500).send({ message: err })
    } else {
      return res.status(200).send({ message: 'File upload' })
    }
  })
})
const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})
