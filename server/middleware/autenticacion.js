
const jwt = require('jsonwebtoken');


// ===== Verificar Token ======

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

    // console.log(token);


};


// ===== Verifica AdminRole =====


let verificaAdminRole = (req, res, next) => {
    
    let usuario = req.usuario;

    //console.log(req.usuario);

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            },
            usuario
        });

    }

}


module.exports = {
    verificaToken,
    verificaAdminRole
}