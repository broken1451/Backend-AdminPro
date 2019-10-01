// Ruta Usuarios /usuarios

// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');

// Plugin de encripttacion de password
var bcrypt = require('bcryptjs');

// Plugin de token
var jwt = require('jsonwebtoken');

// Archivo de configuracion de la semilla
    // var SEED = require('../config/config').SEED;
var SEED = require('../config/config');


// Utenticacion
var mdwareAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

// Importar modelo de usuario
var Usuario = require('../models/usuario');

//=============================================================================================
// Metodo Obtener todos los usuarios
//=============================================================================================
app.get('/', (req, res, next) => {

    // Usando mongoDB y esquema de usuario y filtrar por campos
    Usuario.find({}, 'nombre email img role').exec( (errMongo, usuariosMongo) => {
        if (errMongo) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando usuarios",
                errors: errMongo
            })
        }

        res.status(200).json({
            ok: true,
            mensaje: "Usuarios",
            usuarios: usuariosMongo
        })
        // console.log('Res: ', res);
    });
});

/* 
    //=============================================================================================
    // Verificar token con un midleware(siempre se ejecutan de primero)
    //=============================================================================================

    app.use('/', (req,res,next)=>{
        // paramatro opcional para leer el token por la url
        var token = req.query.token;
        var reqQueryToken = req.query;
        console.log('token: ', token);
        console.log('reqQueryToken req.query: ', reqQueryToken);
        
        // jwt.verify('token que recibe de la peticion', semillas, callback(err,decoded-informacion del usuario q se coloco en el payload ) )
        jwt.verify(token, SEED, (err, decoded) => {
            // Enviar token opcional por la url 
                //localhost:3000/usuario?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvQmRMb2dpbiI6eyJyb2xlIjoiQURNSU5fUk9MRSIsIl9pZCI6IjVkOTEyNTQ3YWZhZTI1MTgyOGM5M2JiNSIsIm5vbWJyZSI6InRlc3QxIiwiZW1haWwiOiJ0ZXN0MUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjopIiwiX192IjowfSwiaWF0IjoxNTY5OTQyMjQyLCJleHAiOjE1Njk5NTY2NDJ9.g9sLtl82cI0qhfxsXGsGNqsN6TNtWQLNYhqYguF9Q4A
            console.log('decoded: ', decoded);
                if (err) {
                    return res.status(401).json({
                        ok: false,
                        mensaje: "Error TOKEN no valido",
                        // errors: err
                        errors: { message: 'Error TOKEN no valido' }
                    });
                }
                next(); // continua con las siguientes funciones si no hay error 
            });
    });

*/

//=============================================================================================
// Metodo de Crear/Ingresar un  nuevousuario a la bd  
//=============================================================================================
// app.post('/', mdwareAutenticacion.verificaToken ,(req, res) => {
app.post('/', mdwareAutenticacion ,(req, res) => {
    // console.log('req: ', req);
    var body = req.body; // solo funciona con body parses configurado application/x-www-form-urlencoded
    console.log('body: ', body);

    // Hace referencia al modelo de datos de Usuario
    var usuario = Usuario({
        nombre : body.nombre,
        email: body.email,
        // password: bcrypt.hashSync(dato a encriptar),
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });

    usuario.save((err,usuarioGuardado) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario",
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            usuarioGuardado: usuarioGuardado,
            usuarioToken: req.usuarioBdLogin,
            body:body
        });
    });
});

//=============================================================================================
// Metodo de actualizar un usuario en la bd  
//=============================================================================================
    // app.put('/:recurso obligatorio de la app', (req,res) => {
// app.put('/:id', mdwareAutenticacion.verificaToken ,(req,res) => {
app.put('/:id', mdwareAutenticacion ,(req,res) => {
    var id = req.params.id;
    var rekuest= req.params;
    var body = req.body;
    
    Usuario.findById(id, (err,usuarioId)=>{
         
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });
        }

        if (!usuarioId) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con el " + id + "no existe",
                // errors: err
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuarioId.nombre = body.nombre;
        usuarioId.email = body.email;        
        usuarioId.role = body.role;
        
        usuarioId.save( (err, usuarioGuardadoId) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: err
                });
            }

            usuarioGuardadoId.password = ':)'
        
            res.status(200).json({
                ok: true,
                rek: rekuest,
                usuarioId: usuarioGuardadoId,
                usuarioToken: req.usuarioBdLogin
            });
        });
      
    });
});


//=============================================================================================
// Metodo de borrar un usuario en la bd  
//=============================================================================================
// app.delete('/:id', mdwareAutenticacion.verificaToken,(req,res) => {
app.delete('/:id', mdwareAutenticacion,(req,res) => {

    var id = req.params.id;
    var body = req.params;

    Usuario.findByIdAndRemove(id,(err, usuarioBorradoId) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error borrar usuario",
                errors: err
            });
        }

        if (!usuarioBorradoId) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con el " + id + "no existe",
                // errors: err
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuarioBorradoId: usuarioBorradoId
        });
    });

});



// Exportar Modulo
module.exports = app;











































































































































































































































































































/*
app.get('/', (req, res, next) => {

    // Usando mongoDB y esquema de usuario y filtrar por campos
    Usuario.find({}, 'nombre email img role').exec( (errMongo, usuariosMongo) => {
        if (errMongo) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando usuarios",
                errors: errMongo
            })
        }

        res.status(200).json({
            ok: true,
            mensaje: "Usuarios",
            usuarios: usuariosMongo
        })
        // console.log('Res: ', res);
    });
    
        // Usuario.find({}, ("resultado de la busqueda")
    // Usuario.find({}, (errMongo, usuariosMongo ") => {
    //     if (errMongo) {
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: "Error cargando usuarios",
    //             errors: errMongo
    //         })
    //     }

    //     res.status(200).json({
    //         ok: true,
    //         mensaje: "Usuarios",
    //         usuarios: usuariosMongo
    //     })
    // });
});



      // Usuario.find({}, ("resultado de la busqueda")
    // Usuario.find({}, (errMongo, usuariosMongo ") => {
    //     if (errMongo) {
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: "Error cargando usuarios",
    //             errors: errMongo
    //         })
    //     }

    //     res.status(200).json({
    //         ok: true,
    //         mensaje: "Usuarios",
    //         usuarios: usuariosMongo
    //     })
    // });
*/