// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');

// Inicializar variables
var app = express();

// Modulo de nodeJs para crear path validos y correctos
const path = require('path'); 

// File System
var fileSystem = require('fs');


app.get('/:tipo/:imagen', (req, res, next) => {
    
    var tipoImagen = req.params.tipo
    var nombreImagen = req.params.imagen
    console.log('tipoImagen: ',tipoImagen );
    console.log('nombreImagen: ', nombreImagen);
    
    // Creacion del path  __dirname(toda la ruta donde se encuentra en este momento), `referencia a donde se encuentra la imagen`
    var pathImagen = path.resolve(__dirname,`../uploads/${tipoImagen}/${nombreImagen}`); // Resolver el path para que siempre quede correcto
    console.log('pathImagen: ', pathImagen);

    if (fileSystem.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname,`../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }


});

// Exportar Modulo
module.exports = app;
