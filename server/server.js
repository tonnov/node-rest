require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');

const app = express()

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
 
app.get('/usuarios', function (req, res) {
  res.json('Get usuarios Local')
});

app.post('/usuarios', function (req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {

        res.json({
            persona: body
        })
    }
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


mongoose.connect('mongodb://localhost:27017/cafe', (err, resp) => {

    if( err ) throw err;

    console.log('Base de datos ON');
});


 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto:', process.env.PORT);
});