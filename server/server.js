require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(  require('./routes/usuario')  );

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/cafe', {useNewUrlParser: true }, (err, resp) => {

    if( err ) throw err;

    console.log('Base de datos ON');
});


 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto:', process.env.PORT);
});