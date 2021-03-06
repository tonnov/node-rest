
const express = require('express');

const { verificaToken } = require('../middleware/autenticacion');

let app = express();

let Producto =  require('../models/producto');

// =====================================
// Obtener productos
app.get('/producto', verificaToken, ( req, res ) => {

    let estado = { disponible: true };
    let desde = req.query.desde || 0;
    desde =  Number(desde);

    //console.log(req.query);
    

    Producto.find(estado)
    .skip(desde)
    .limit(5)
    .populate('categoria','categoria')
    .populate('usuario','nombre')
    .exec( (err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error de BD'
                }
            });
        }

        if (!productos) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se han encontrado productos'
                }
            });
        }

        Producto.countDocuments( estado, (err, disp) => {
            res.json({
                ok: true,
                disponible: disp,
                productos
            })
        })


    });

});

// =====================================
// Obtener producto por Id
app.get('/producto/:id', verificaToken, ( req, res ) => {

    let id = req.params.id;
    // console.log(id);
    Producto.findById(id)
    .populate('usuario','nombre email')
    .populate('categoria','categoria')
    .exec((err, productoDB)  => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error en la consulta',
                    err
                }
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado',
                    err
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// =====================================
// Buscar producto
app.get('/producto/buscar/:termino', verificaToken, ( req, res ) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({nombre: regexp})
        .populate('categoria', 'nombre')
        .exec((err, productoDB ) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error de base de datos',
                        err
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});


// =====================================
// Crear nuevo producto producto por Id
app.post('/producto', verificaToken, ( req, res) => {

    let usr = req.usuario._id;
    let prod = req.body;
    
    //console.log(usr, body);
    

    let producto = new Producto({
        nombre: prod.nombre,
        precioUni: prod.precioUni,
        descripcion: prod.descripcion,
        categoria: prod.categoria,
        usuario: usr
    });

    producto.save( (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Falló la BD'
                }
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    })

});


// =====================================
// Actualizar producto por Id
app.put('/producto/:id', verificaToken, ( req, res ) => {

    let id = req.params.id;
    let prod = req.body;

    let nprod = {
        nombre: prod.nombre,
        precioUni: prod.precioUni,
        descripcion: prod.descripcion,
        categoria: prod.categoria
    }

    Producto.findByIdAndUpdate(id, nprod, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Error de consulta'
                }
            });
        }

        if (!productoDB) {
            res.status(500).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el producto'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Se ha actualizado correctamente',
            producto: productoDB
        });
    });

});


// =====================================
// Baja de producto (cambiar estado a false)
app.delete('/producto/:id', verificaToken, ( req, res ) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, {new: true}, (err, productoDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Error de consulta'
                }
            });
        }

        if (!productoDB) {
            res.status(500).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el producto'
                }
            });
        }

        res.json({
            ok: true,
            message: 'El producto se dio de baja correctamente',
            productoDB
        });
    });

})




module.exports = app;