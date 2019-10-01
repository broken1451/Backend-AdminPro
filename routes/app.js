// Ruta principal /

// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');

// Inicializar variables
var app = express();

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente"
    })

});

// Exportar Modulo
module.exports = app;
