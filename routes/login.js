// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');

// Plugin de encripttacion de password
var bcrypt = require('bcryptjs');

// Plugin de token
var jwt = require('jsonwebtoken');

// Archivo de configuracion de la semilla
    // var SEED = require('../config/config').SEED;
var SEED = require('../config/config');

// Inicializar variables
var app = express();

// Importar modelo de usuario para login
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({email: body.email}, (err,usuarioBdLogin) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: {message: 'Error no se encuentra usuario'}
            });
        }

        if (!usuarioBdLogin) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - email",
                // errors: {message:'Error no se encuentra email: ' + body.email +  ' asociado'}
                errors: {message: 'Error no se encuentra email asociado'}
            });
        }

        // Comparar Contrasena
        if (!bcrypt.compareSync(body.password, usuarioBdLogin.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - password",
                errors: {message: 'Error las claves no son iguales'}
            });
        }

        // Crear un token
        usuarioBdLogin.password = ':)'
            // var token = jwt.sign({dataa colocar en el token(payload)}, seed/semillas(definir algo de forma unica del token),{fecha de exipracion del token})
            var token = jwt.sign({usuarioBdLogin:usuarioBdLogin},SEED,{expiresIn:14400})//4horas

        res.status(200).json({
            ok: true,
            usuarioBdLogin: usuarioBdLogin,
            token:token,
            mensaje: "Login funcionando",
            body: body,
            id: usuarioBdLogin._id,
            
        });
    });
});

module.exports = app;

