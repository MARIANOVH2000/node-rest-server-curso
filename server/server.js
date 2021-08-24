//exportamos express
const express = require('express');
//exportamos mongoose
const mongoose = require('mongoose');
const app = express();
//exportamos la configuracion del puerto 
require('./config/config');
//exportamos body parser
var bodyParser = require('body-parser');
//parse aplication/x-wwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse APLICATTION/JSON
app.use(bodyParser.json());
//requerimos las rutas del usuario
//configuracion global de rutas
app.use(require('./routes/index'));

//nos conectamos a la bd mongodb
mongoose.connect(process.env.URLDB, {
    //paramteros pre establecidos
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    //si hay error lo capturamos 
    if (err) throw err;
    //mostramos por consola que estaMOS CONECTADOS A LA BD
    console.log('base de datos ONLINE');
});
//ESCUCHAMOS EL PUERTO 3000
app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto: ", 3000);
})