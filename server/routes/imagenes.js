
const express = require('express');

const fs = require('fs');
const path = require('path');

let app = express();

let { verificaTokenImg } = require('../middleware/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) =>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    //(console.log(tipo,img);


    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');

    if ( fs.existsSync( pathImagen ) ) {
        res.sendFile( pathImagen);
    } else {
        res.sendFile(noImagePath);
    }

});


module.exports = app;