const jwt = require('jsonwebtoken');
//==============================
//Verficar token
//==============================
let verificarToken = (req, res, next) => {
    let token = req.get('token');
    //req.get('token') jala al token del header
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

let verficarUsuarioRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};
module.exports = {
    verificarToken,
    verficarUsuarioRole
}