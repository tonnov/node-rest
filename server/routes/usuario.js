
const express = require('express');
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
        password: body.password,
        role: body.role
      });

      usuario.save( (err, usuarioDB) => {

        if(err) {
            return res.status(400).json ({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

      });

    });
  
  app.put('/usuarios/:id', function (req, res) {
      let id = req.params.id;
      res.json({
          id
      });
  });
   
  app.delete('/usuarios', function (req, res) {
      res.json('Delete usuarios')
  });


  module.exports = app;