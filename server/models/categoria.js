
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
        required: [true, 'Nombre de categoria requerido']
    },
    descripcion: {
        type: String
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'User'
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