
const express = require('express');

//let { verificaToken } = require('../middleware/autenticacion');

let { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

//const bcrypt = require('bcryptjs');

let app = express();

let Categoria = require('../models/categoria');

const _ = require('underscore');


// ====================================================================
// ====================================================================


// Muestra todas las categorias
app.get('/categoria', (req,res) => {

    Categoria.find()
        .exec( (err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            })

        })

});

// Muestra categoria por ID
app.get('/categoria/:id', (req, res) => {
    
    let id = req.params.id;

    // console.log('Id solicitado ', id);
    
    Categoria.findById(id, (err, categoria) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            categoria
        });
        
    });


});

// Crear nueva categoria
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    
    let usr = req.usuario._id;
    //console.log(usr);
    
    let body = req.body;

    let categoria = new Categoria({
        categoria: body.categoria,
        descripcion: body.descripcion,
        usuario: usr,
        estado: body.estado
    });

    categoria.save( (err, categoriaDB) => {

        if (err) {
            return res.status(500).json ({
                ok:false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json ({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Actualizar categoria
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['categoria','descripcion']);

    let query = { _id: id };

    Categoria.findOneAndUpdate( query, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });

});

// Eliminar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let query = { _id: id };

    Categoria.findOneAndDelete(query, (err, categoriaDel) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDel
        });
    });
});



module.exports = app;