
const express = require('express');

const { verificaToken } = require('../middleware/autenticacion');

let app = express();

let Producto =  require('../models/producto');

// =====================================
// Obtener productos
app.get('/producto', ( req, res ) => {

    let estado = { disponible: true };

    Producto.find(estado)
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
app.get('/producto/:id', ( req, res ) => {

    let id = req.params.id;
    // console.log(id);
    Producto.findById(id, (err, productoDB) => {

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
            productoDB
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

        res.json({
            ok: true,
            productoDB
        });

    })

});


// =====================================
// Actualizar producto por Id
app.put('/producto/:id', ( req, res ) => {

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
            productoDB
        });
    });

});


// =====================================
// Baja de producto (cambiar estado a false)
app.delete('/producto/:id', ( req, res ) => {

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