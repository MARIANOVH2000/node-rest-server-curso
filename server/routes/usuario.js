const express = require('express'); //exportamos express
const Usuario = require('../models/usuario'); //exportamos el modelo usuario
const bcrypt = require('bcrypt'); //exportamos la libreria bcrypt para  encriptar lA CONTRAsaeña
const _ = require('underscore'); //exportamos la libreria underscore para que nos permita solo lo que escribimos en los argumentos actualizar  
const usuario = require('../models/usuario'); //exportamos los modelos de db de usuario
const app = express(); //asignamos express
//creamos el apartado /usuario  tsnto para el get, post ,put y delete

//get para listaR
app.get('/usuario', function(req, res) {
    //variable para listar 
    let estadoLista = {
        estado: true
    };
    //para hacer qaue inice desde un numero de registro
    let desde = req.query.desde || 0;
    desde = Number(desde);
    //para el limite de datos
    let limite = req.query.limite || 5;
    limite = Number(limite);
    //res.json('get usuario local!!!!!s');
    //con find hacemos en recorrido de todo  
    Usuario.find(estadoLista, 'nombre email role estado google img')
        //si ingresara directo el estado lo poniera Usuario.find({estado=true}, 'nombre email role estado google img') con llaves 
        //SALTAR LOS PRIMEROS 5
        .skip(desde)
        //limite de cuantos quiero QUE MUESTRE
        .limit(limite)
        //ejecutamos
        .exec((err, usuarios) => {
            //si hay error
            if (err) {
                //Retorne un estadode 400 con un falso y el error
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //conteo de registros
            /* google: true //para que me filtre todos los de goolgle sean igual a true */
            Usuario.count(estadoLista, (err, conteo) => {
                //lanzar
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            });





        })
});
app.post('/usuario', function(req, res) {

    let body = req.body; //creamos la variable body y lo asignamos el body de la petcicon usuario 
    let usuario = new Usuario({ //asiganmos los datos  al objeto usuario del models usuario 
        email: body.email,
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10), //encirptamos el password con bcrypt y el hashSync es para hacerlo de forma sincrona 
        //y el 10 es de cuantas veces debemos de hacerlo
        role: body.role
    })
    usuario.save((err, usuarioDB) => { //guardamos el usario en la collection 
        if (err) { //si hay error que retorne un estado de 400 y que me devuelva false y el error
            return res.status(400).json({
                ok: false,
                err
            });

        }
        //si no hay error me retorne un true yh asigen el asuario al usuariodb
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});

//el put
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id; //asignamos los datos del id puesto en el url a la variable id
    let body = _.pick(req.body, ['nombre', 'email', 'img', ' role', 'estado']); //asignamos a la variable bodi todo lo quie queremos quie 
    //se modifique con la libreria underscore 
    Usuario.findByIdAndUpdate(id, body, { //modificamos los datos con findByIdAndUpdate tambien se pued ehacer con findById
        new: true,
        /*para mostrar las ac tializaciones en el postman*/
        runValidators: true /*para las validaciones*/
    }, (err, usuarioDB) => {
        if (err) { //si hay error mostrar el erro 400 con un false y el eroro
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //sino guardar y igualar la variable usuario  a usuariodb
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
//el delete
app.delete('/usuario/:id', function(req, res) {

    //res.json('delete usuario');
    let id = req.params.id; //asignamos el dato A La variable id
    //guardemos el estado en la variable cambiaEstado como false
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { //findByIdAndRemove para borrar de la base de datos
        //si hay un error retornamos el erorr 400 con un  false 
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        };
        //para comprobar si el usuario existe un en la base de datos igualamos si es igual a null
        if (usuarioBorrado == null) {
            //retornamos un estado de rror 400 con un false y en eror 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        //  mostramos un true con los dotos de usuario borrado 
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});
//exportar el modulo
module.exports = app;