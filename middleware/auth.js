const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

    const token = req.header('x-auth-token');
    
    if (!token) return res.status(401).json({msg: "Permiso no valido"});

    try {
        const cifrado = jwt.verify(token, process.env.SECRET);

        req.user = cifrado.user;

        next();

    } catch (error) {
        res.status(401).json({msg: "El Token no es valido"});
        console.log(error);
    }

}