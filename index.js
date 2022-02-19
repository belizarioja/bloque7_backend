const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const config = require("./config/general")
var fs = require('fs')

var corsOptions = {
  origin: '*'
};

app.use(fileUpload())
// parse requests of content-type - application/json
// app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(cors(corsOptions));
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
app.post(config.servidor + '/deletefiles', function (req, res) {
  const { img } = req.body
  const pathViejo = __dirname + '/files/' + img
  if (fs.existsSync(pathViejo)) {
    fs.unlinkSync(pathViejo)
    res.status(200).send('Archivo eliminado!')
  }
})
app.get(config.servidor + '/files/:img', function (req, res) {
  const img = req.params.img
  const path = __dirname + '/files/' + img
  if (fs.existsSync(path)) {
    const imgbase64 = fs.readFileSync(path, { encoding: 'base64' })
    // res.sendFile(path)
    res.status(200).send({ imgbase64, message: 'Imagen encontrada!' })
  } else {
    res.status(202).send({ message: 'Imagen no encontrada!' })
  }

});
app.post(config.servidor + '/upload', (req, res) => {
  const { nombreimagen } = req.body
  // console.log(req.files)
  let EDFile = req.files.inputImg
  EDFile.name = nombreimagen + '.png'
  EDFile.mv(`./files/${EDFile.name}`, err => {
    if (err) {
      return res.status(500).send({ message: err })
    } else {
      return res.status(200).send({ message: 'Imagen cargada!' })
    }
  })
})
const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})
