// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();


// Conexion con la bd de mongo

    /* // getting-started.js
            var mongoose = require('mongoose');
                mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});*/

        // una manera de conectarse con mongo:
        // mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',callback de conexion(err, res) => {
        //     if (err) {
        //         throw  err;
        //     }
        //     console.log('Base de datos: \x1b[32m%s', 'online');
        // });

    mongoose.connect('mongodb://localhost:27017/HospitalDB',{ useUnifiedTopology: true, useNewUrlParser: true } , (err, res) => {
        if (err) {
            console.log('Err: ', err);
            throw  err;
            // return  err;
        } else { 
            console.log('Base de datos: \x1b[32m%s', 'online');
            // console.log('Res: ', res);
        }
});


// Rutas 
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente"
    })

});


// Escuchar peticiones o servidor
app.listen(3000, () => {
    // cambiar color la palabra online
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s', 'online');
});
































































