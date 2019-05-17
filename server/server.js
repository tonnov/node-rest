require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use( express.static( path.resolve(__dirname, '../public') ) );

console.log(path.resolve(__dirname, '../public') );

app.use(  require('./routes/index')  );

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useFindAndModify: false }, (err, resp) => {

    if( err ) throw err;

    console.log('Base de datos ON');
});


 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto:', process.env.PORT);
});