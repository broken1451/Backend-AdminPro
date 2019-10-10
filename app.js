// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body Parses configuracion
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importar Rutas 
    var appRouterPrincipal = require('./routes/app');
    var usuarioRoute = require('./routes/usuario');
    var usuarioLoginRoute = require('./routes/login');
    var hospitalRoute = require('./routes/hospital');
    var medicoRoute = require('./routes/medico');
    var busquedaRoute = require('./routes/busqueda');
    var uploadRoute = require('./routes/upload');
    var imagenesRoute = require('./routes/imagenes');



// Conexion con la bd de mongo
mongoose.connect('mongodb://localhost:27017/HospitalDB',{ useUnifiedTopology: true, useNewUrlParser: true } , (err, res) => {
    if (err) {
        console.log('Err: ', err);
        throw  err;
        // return  err;
    } else { 
        console.log('Base de datos:  online');
        // console.log('Res: ', res);
    }
});
/* // getting-started.js
        var mongoose = require('mongoose');
            mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

    // una manera de conectarse con mongo:
    // mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',callback de conexion(err, res) => {
    //     if (err) {
    //         throw  err;
    //     }
    //     console.log('Base de datos: \x1b[32m%s', 'online');
    // });
*/

/*Servidor index
// Server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/


// Rutas, Middlewares

    app.use('/usuario', usuarioRoute);
    app.use('/hospital', hospitalRoute);
    app.use('/medico', medicoRoute);
    app.use('/login', usuarioLoginRoute);
    app.use('/busqueda', busquedaRoute);
    app.use('/upload', uploadRoute);
    app.use('/imagen', imagenesRoute);
    app.use('/', appRouterPrincipal);


    /*
        app.get('/', (req, res, next) => {
            res.status(200).json({
            ok: true,
            mensaje: "Peticion realizada correctamente"
            })
        });

    */  


// Escuchar peticiones o servidor
app.listen(3000, () => {
    // cambiar color la palabra online
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s', 'online');
});
































































