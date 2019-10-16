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

// ==========================================================================================
// Google
// ==========================================================================================
var CLIENT_ID = require('../config/config');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ==========================================================================================
// Autenticacion con Google
// ==========================================================================================
 async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    // console.log('Payload Google: ', payload);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        payload:payload

    }   
 }

 app.post('/google', async(req, res) => {

    var token = req.body.token;
    console.log('Token Google: ', token);

    var googleUser = await verify(token).catch((err)=> {
        return res.status(403).json({
            ok: false,
            mensaje: "Error token no valido",
            errors: {message: 'Error token no valido'},
            err:err
        });
    });

    // Verificar si existe si el correo gmail 
    Usuario.findOne({email: googleUser.email}, (err,usuarioBdLogin) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: {message: 'Error no se encuentra usuario'}
            });
        }

        if (usuarioBdLogin) {
            
            if (usuarioBdLogin.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error debe usar su autenticacion normal ",
                    errors: {message: 'Error debe usar su autenticacion normal'}
                });
            } else {
                var token = jwt.sign({usuarioBdLogin:usuarioBdLogin},SEED,{expiresIn:14400})//4horas
                res.status(200).json({
                    ok: true,
                    usuarioBdLogin: usuarioBdLogin,
                    token:token,
                    mensaje: "Login funcionando",
                    id: usuarioBdLogin._id,
                });
            }
        } else {
            // El usuario no existe hay que crearlo
            var usuario = new Usuario();
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.password = ":)";
                usuario.google = googleUser.google;

            usuario.save((err,usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al guardar usuario",
                        errors: {message: 'Error al guardar usuario'}
                    });
                }
                var token = jwt.sign({usuarioGuardado:usuarioGuardado},SEED,{expiresIn:14400})//4horas
                res.status(200).json({
                    ok: true,
                    usuarioGuardado: usuarioGuardado,
                    token:token,
                    mensaje: "Login funcionando",
                    id: usuarioGuardado._id,
                });
            });
        }
    });
    // return res.status(200).json({
    //     ok: true,
    //     mensaje: "Peticion Exitosa",
    //     googleUser:googleUser
    // });
 });




// ==========================================================================================
// Autenticacion Normal
// ==========================================================================================
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

