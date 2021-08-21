const express = require('express');
const cors = require('cors');
const app = express();
// const router = express.Router();

var corsOptions = {
    origin: '*'
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// const usuarios = require("./controllers/user.controller.js");
const usermodel = require("./models/user.models");
// const asistenciamodel = require("./models/producto.models");
// const servidor = '/bloque7_backend'
// const servidor = ''
app.use(usermodel);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
// module.exports = router;
