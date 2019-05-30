
const express = require('express');

const { verificaToken } = require('../middleware/autenticacion');

let app = express();

let Producto =  require('../models/producto');

// =====================================
// Obtener productos
app.get('/producto', ( req, res ) => {

    Producto.find({})
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

        Producto.countDocuments( { disponible: true }, (err, disp) => {
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

});


// =====================================
// Baja de producto (cambiar estado a false)
app.delete('/producto/:id', ( req, res ) => {

})




module.exports = app;