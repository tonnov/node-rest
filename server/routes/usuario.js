
const express = require('express');

const bcrypt = require('bcryptjs');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

const app = express();

app.get('/usuarios', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = Number(req.query.limite || 5);

    let getEstado = {
        estado: true
    }

    Usuario.find( getEstado , 'nombre email role estado google' )
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {
                
                if(err) {
                    return res.status(400).json ({
                        ok: false,
                        err
                    });
                }

                Usuario.countDocuments({  }, (err, conteo) => {
                    
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })
                })

            })
    //res.json('Get usuarios Local')
  });
  
  app.post('/usuarios', [verificaToken, verificaAdminRole], (req, res) => {
      let body = req.body;

      let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado,
        google: body.google
      });

      usuario.save( (err, usuarioDB) => {

        if(err) {
            return res.status(400).json ({
                ok: false,
                err
            });
        }

        //usuarioDB.password =  null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })

      });

    });
  
  app.put('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre','email','img','role','estado']);

      Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err,usuarioDB) => {

        if(err) {
            return res.status(400).json ({
                ok: false,
                err
            });
        }


          res.json({
              ok: true,
              usuario: usuarioDB
          });

      })

  });
   
  app.delete('/usuarios/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate( id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if(err) {
            return res.status(400).json ({
                ok: false,
                err
            });
        }


          res.json({
              ok: true,
              usuario: usuarioDB
          });

    });

    // Usuario.findByIdAndRemove(id, (err, userDeleted) => {

    //     if(err) {
    //         return res.status(400).json ({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (userDeleted == null) {
    //         return res.status(400).json ({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }


    //     res.json({
    //         ok: true,
    //         usuario: userDeleted
    //     })

    // })
  });


  module.exports = app;