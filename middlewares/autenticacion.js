var express = require('express');
var appMiddleware = express();

// Plugin de token
var jwt = require('jsonwebtoken');

// Archivo de configuracion de la semilla
    // var SEED = require('../config/config').SEED;
var SEED = require('../config/config');


//=============================================================================================
// Verificar token con un midleware(siempre se ejecutan de primero)
//=============================================================================================

appMiddleware = function (req,res,next) {
      // paramatro opcional para leer el token por la url
    var token = req.query.token;
    var reqQueryToken = req.query;
    console.log('token: ', token);
    console.log('reqQueryToken req.query: ', reqQueryToken);
    // console.log('req: ', req);
    
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

            req.usuarioBdLogin = decoded.usuarioBdLogin
            next(); // continua con las siguientes funciones si no hay error 
            // res.status(200).json({
            //     ok: true,
            //     decoded:decoded
            // });
        });
 }



    // Una manera
// exports.verificaToken = function (req,res,next) {
//     // paramatro opcion para leer el token por la url
//     var token = req.query.token;
//     var reqQueryToken = req.query;
//     console.log('token: ', token);
//     console.log('reqQueryToken req.query: ', reqQueryToken);
    
//     // jwt.verify('token que recibe de la peticion', semillas, callback(err,decoded-informacion del usuario q se coloco en el payload ) )
//     jwt.verify(token, SEED, (err, decoded) => {
//         // Enviar token opcional por la url 
//             //localhost:3000/usuario?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvQmRMb2dpbiI6eyJyb2xlIjoiQURNSU5fUk9MRSIsIl9pZCI6IjVkOTEyNTQ3YWZhZTI1MTgyOGM5M2JiNSIsIm5vbWJyZSI6InRlc3QxIiwiZW1haWwiOiJ0ZXN0MUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjopIiwiX192IjowfSwiaWF0IjoxNTY5OTQyMjQyLCJleHAiOjE1Njk5NTY2NDJ9.g9sLtl82cI0qhfxsXGsGNqsN6TNtWQLNYhqYguF9Q4A
//         console.log('decoded: ', decoded);
//             if (err) {
//                 return res.status(401).json({
//                     ok: false,
//                     mensaje: "Error TOKEN no valido",
//                     // errors: err
//                     errors: { message: 'Error TOKEN no valido' }
//                 });
//             }

//             req.usuarioBdLogin = decoded.usuarioBdLogin
//             next(); // continua con las siguientes funciones si no hay error 
//             // res.status(200).json({
//             //     ok: true,
//             //     decoded:decoded
//             // });
//         });
// }


module.exports = appMiddleware;


























































































































































/*
app.use('/', (req,res,next)=>{
    // paramatro opcion para leer el token por la url
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