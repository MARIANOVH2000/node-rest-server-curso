const express = require('express');
const { verificarToken, verficarUsuarioRole } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');
const _ = require('underscore'); //exportamos la libreria underscore para que nos permita solo lo que escribimos en los argumentos actualizar  
const { populate } = require('../models/producto');


//===============================
//listar  productos
//=============================
app.get('/productos', verificarToken, (req, res) => {
    //variable desde de la paginacion
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        //paginacion 
        .skip(desde)
        .limit(5)
        //fin de la paginacion
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productosDB,
                    cuantos: conteo

                });
            });
        })
});


//===============================
//listar  productos por id
//=============================
app.get('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.findById(id)
        //paginacion 
        .skip(desde)
        .limit(5)
        //fin de la paginacion
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'ID no existe '
                    }
                });
            }

            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productosDB,
                    cuantos: conteo

                });
            });
        })
});

//===============================
//buscar  productos
//=============================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    //la librearia RegExp viene incluida en nodejs se utiliza para hacer busquedas que no 
    //importa el lugar donde se hubique las letras que ingreso igual me lo valida para buscar
    //el termini 'i' es para que sea insensible a la mayusculas y minusculas
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoBuscado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'ID no existe '
                    }
                });
            }
            res.status(201).json({
                ok: true,
                productoBuscado
            });
        });
})








//===============================
//insertar  productos
//=============================
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible, //se pone tambien los que estan por default
        categoria: body.categoria,
        usuario: req.usuario._id

    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error en el servidor'
                }
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo registrar el producto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

});
//===============================
//modificar  productos
//=============================
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    // let body = req.body;
    let body = _.pick(req.body, ['nombre', 'precioUni',
        'descripcion', 'disponible', 'categoria', req.usuario._id
    ]); //asignamos a la variable bodi todo lo quie queremos quie 
    /* let descProducto = {
         nombre: body.nombre,
         precioUni: body.precioUni,
         descripcion: body.descripcion,
         disponible: body.disponible,
         categoria: body.categoria,
         usuario: req.usuario._id
     }*/

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error en el servidor'
                }
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

});
//===============================
//desactivar  productos
//=============================
app.delete('/producto/:id', [verificarToken, verficarUsuarioRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiaEstado, {
        new: true,
    }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error en el servidor'
                }
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'Producto desactivado'

        })
    })

});






module.exports = app;