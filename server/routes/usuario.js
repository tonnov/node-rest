
const express = require('express');

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuarios', function (req, res) {
    res.json('Get usuarios Local')
  });
  
  app.post('/usuarios', function (req, res) {
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
  
  app.put('/usuarios/:id', function (req, res) {
      let id = req.params.id;
      let body = req.body;

      Usuario.findByIdAndUpdate( id, body, { new: true }, (err,usuarioDB) => {

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
   
  app.delete('/usuarios', function (req, res) {
      res.json('Delete usuarios')
  });


  module.exports = app;