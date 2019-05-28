
const mongoose = require('mongoose');
const uniqueValidator =  require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    categoria: {
        type: String,
        unique: true,
        required: [true, 'Nombre de categoria requerido']
    },
    descripcion: {
        type: String,
        required: [true, 'Descripcion requerida']
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});


categoriaSchema.methods.toJSON = function() {
    
    let categoria = this;
    let categoriaObject = categoria.toObject();

    return categoriaObject;
}

//categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'} );

module.exports = mongoose.model( 'Categoria', categoriaSchema );