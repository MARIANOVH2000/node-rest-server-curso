const express = require('express');
const app = express();
require('./config/config');
var bodyParser = require('body-parser');
//parse aplication/x-wwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse APLICATTION/JSON
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('get usuario');
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre == undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        });
    }
    res.json({
        body
    });
});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
});
app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto: ", 3000);
})