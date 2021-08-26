const express = require('express');
const { verificarToken, verficarUsuarioRole } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');
const _ = require('underscore'); //exportamos la libreria underscore para que nos permita solo lo que escribimos en los argumentos actualizar  




let app = express();

//===============================
//mostrar todas las categorias
//=============================
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion') //para ordenar por descripcion
        .populate('usuario', 'nombre email') //para mostrar el usuario en este caso solo el nombre y el email
        //populate('usuario', 'nombre email') puedo ponerlo otro para jalar otros datos 
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categoriaDB,
                    cuantos: conteo

                });
            });
        })
});


//===============================
//mostrar todas las categorias
//=============================
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no es coerrecto'
                }
            })
        }
        Categoria.count((err, conteo) => {
            res.json({
                ok: true,
                categoriaDB,
                cuantos: conteo

            });
        });
    })


});
//===============================
//insertar  las categorias
//=============================
app.post('/categoria', verificarToken, (req, res) => {
    // let id = req.params.id; //asignamos el dato A La variable id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
            //req.usuario._id para traer el id del usuario por medio del token
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


});
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id_cate = req.params.id;
    let body = _.pick(req.body, ['descripcion', req.usuario._id]); //asignamos a la variable bodi todo lo quie queremos quie 
    //se modifique con la libreria underscore 

    /*let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
            //req.usuario._id para traer el id del usuario por medio del token
    });*/
    Categoria.findByIdAndUpdate(id_cate, body, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //sino guardar y igualar la variable usuario  a usuariodb
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


app.delete('/categoria/:id', [verificarToken, verficarUsuarioRole], (req, res) => {
    //res.json('delete usuario');
    let id = req.params.id; //asignamos el dato A La variable id
    //guardemos el estado en la variable cambiaEstado como false

    Categoria.findByIdAndRemove(id, { new: true }, (err, categoriaBorrada) => {
        // Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => { //findByIdAndRemove para borrar de la base de datos
        //si hay un error retornamos el erorr 400 con un  false 
        if (err) {
            return res.status(400).json({
                ok: false,
                err: ' El id no existe'
            });

        };
        //para comprobar si el usuario existe un en la base de datos igualamos si es igual a null
        if (categoriaBorrada == null) {
            //retornamos un estado de rror 400 con un false y en eror 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        //  mostramos un true con los dotos de usuario borrado 
        res.json({
            ok: true,
            message: 'categoria borrada'
        });
    });
});
//exportar el modulo
module.exports = app;