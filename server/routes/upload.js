
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).
            json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    let tiposVal = ['productos', 'usuarios'];

    if (tiposVal.indexOf( tipo ) < 0 ) {
        
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido, los tipos validos son: ' + tiposVal.join(', '),
                tipo: tipo
            }
        });

    }

    let extVal = ['jpg','jpeg'];

    let archivo = req.files.archivo;

    let archName = archivo.name.split('.');

    let extension = archName[archName.length - 1];
    
    // console.log(extension, extVal.indexOf(extension));

    if ( extVal.indexOf(extension) < 0 ) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension no valida, extensiones validas: ' + extVal.join(', '),
                ext: extension
            }
        });

    }

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    //let mypath = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);

    //console.log(mypath);

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err, req) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al mover',
                    err
                }
            });
        }

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;

            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;

            default:
                console.log(`El tipo ${tipo} no esta soportado`);
                break;
        }
        
        

    });

});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {
        
        if (err) {
            borraImagen(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error'
                }
            });
        }

        if (!usuarioDB) {
            borraImagen(nombreArchivo, 'usuarios');
            
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        if (usuarioDB.img.length > 0) {

            borraImagen(usuarioDB.img, 'usuarios');

        }

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    });

}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) => {

        //console.log(productoDB);
        
        if (err) {
            borraImagen(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraImagen(nombreArchivo, 'productos');
            
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        // var nArchivo = productoDB.img.length == 0 ? nombreArchivo : productoDB.img;
        
        // console.log(nombreArchivo,nArchivo);
        
        if (productoDB.img.length > 0) {
            
            borraImagen(productoDB.img, 'productos');

        }

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });


    });
}

function borraImagen(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if ( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;