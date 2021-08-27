const express = require("express");
const fileUpload = require("express-fileupload");
const Usuario = require("../models/usuario"); //se llama del modelo no a la ruta
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const app = express();

//este midleware hace que todos los archivos  cargados en el se guRDEN en el req.files
app.use(fileUpload());
app.put("/upload/:tipo/:id", function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado ninguna IMAGEN",
            },
        });
    }

    //valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Esta permitido solo " + tiposValidos.join(", "),
                tipo,
            },
        });
    }

    let archivo = req.files.archivo;

    //saber el formato de la imagenes
    let nombreCortado = archivo.name.split(".");
    let extension = nombreCortado[nombreCortado.length - 1];

    //extensiones permitidas
    let extencionesValidas = ["png", "jpg", "gif", "jpeg"];

    //validar las extensiones
    //indeOf para para buscar en el arreglo
    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Las extensiones permitidas son " + extencionesValidas.join(", "),
                extension,
            },
        });
    }
    //cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //mover el archivo
    archivo.mv(
        `uploads/${tipo}/${nombreArchivo}`,
        function(err, archivoGuardado) {
            if (err) {
                return res.status(500).json(err);
            }
            //AQUI IMAGEN CARGADA
            // let resultadoUsuario = tiposValidos.find(tipo => tipo > 'usuarios');

            if (tipo === 'productos') {
                imagenProducto(id, res, nombreArchivo);

            } else {
                imagenUsuario(id, res, nombreArchivo);

            }


        }
    );
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario NO EXISTE",
                },
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo,
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, produtoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!produtoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto NO EXISTE",
                },
            });
        }

        borraArchivo(produtoDB.img, 'productos');

        produtoDB.img = nombreArchivo;
        produtoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo,
            });
        });
    });
}




//funcion para borrar el archivo
function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //si existe la imagen  se hace con el existsSync  y aunque no exista se insertara 
    if (fs.existsSync(pathImagen)) {
        //elimanr la imagen anterior
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;