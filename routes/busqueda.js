// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');

// Inicializar variables
var app = express();

// Importar modelo de usuario
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// =====================================================
// Busqueda por coleccion 
// =====================================================
// localhost:3000/busqueda/coleccion/medico/termino como busqueda 
app.get('/coleccion/:tabla/:busqueda', (req,res)=>{ // cuando tengo /:algo debo mandarlo de esta manera var tabla = req.params.tabla;
    var busqueda = req.params.busqueda; // lo que se escribe en la url 
    var tabla = req.params.tabla; // lo que se escribe en la url 
    console.log('busqueda: ', busqueda);
    console.log('tabla: ', tabla);
    // var parametros = req.params; // parametros obligatorios por la url 
   
    var expRegular = new RegExp(busqueda,'i'); //i es insensible a cualquier palabra 

    if (tabla === 'Hospitales' || tabla === 'hospitales'  || tabla === 'Hospital' || tabla === 'hospital'  ) {
        buscarHospitales(busqueda, expRegular).then((hospitales)=>{
            res.status(200).json({
                ok: true,
                Hospitales: hospitales
            });
        });
    } else if (tabla === 'Medico' || tabla === 'medico' || tabla === 'Medicos' || tabla === 'medicos'  ) {
        buscarMedico(busqueda, expRegular).then((medicos)=>{
            res.status(200).json({
                ok: true,
                Medicos: medicos
            });
        });

    } else if (tabla === 'Usuarios' || tabla === 'usuarios' || tabla === 'Usuario' || tabla === 'usuario'  ) {
        buscarUsuarios(busqueda, expRegular).then((usuarios)=>{
            res.status(200).json({
                ok: true,
                Usuarios: usuarios
            });
        });
    } else {
        return res.status(400).json({
            ok: false,
            mensaje: "Error no se puede encontrar la " + tabla + "  en la bd, Solamente los tipos de busqueda son usuarios, medicos y hospitales",
            error: {message: 'Tipo de tabla o coleccion no valido'}
        });
    }



});





// =====================================================
// Busqueda General
// =====================================================
    // todo/:busqueda
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda; // lo que se escribe en la url 
    console.log('busqueda: ', busqueda);
    // var parametros = req.params; // parametros obligatorios por la url 
   
    var expRegular = new RegExp(busqueda,'i'); //i es insensible a cualquier palabra 
    
    // Hospital.find({nombre: /expesionregular/i }, (err,hospitales) => {
    //     res.status(200).json({
    //         ok: true,
    //         Hospitales: hospitales
    //     })
    // });

     // paramatro opcional para leerlo desde la url   var desde = req.query.desde || 0; query es opcional
    // paramatro opcional para leerlo desde la url 
      var desde = req.query.desde || 0;
          desde = Number(desde);
      console.log('desde: ', desde);

    Promise.all([buscarHospitales(busqueda,expRegular,desde), 
                buscarMedico(busqueda,expRegular,desde),
                buscarUsuarios(busqueda,expRegular,desde)]).then((respuestas) => {
                    res.status(200).json({
                        ok: true,
                        Hospitales: respuestas[0],
                        Medicos: respuestas[1],
                        Usuarios: respuestas[2],
                    });
                });

//    buscarHospitales(busqueda,expRegular).then( (hospitales) => {
//         res.status(200).json({
//             ok: true,
//             Hospitales: hospitales
//         });
//    });

});

// Creando una promesa 
function buscarHospitales( busqueda ,expRegular, desde) {
    
    return new Promise((resolve,reject) => {
    
        Hospital.find({nombre: expRegular},(err,hospitales) => {
            if (err) {
                reject('Error al buscar hospitales', err);
            } else {
                resolve(hospitales);
            }
        }).populate('usuario', 'nombre email').skip(desde).limit(4);
    });
}

function buscarMedico( busqueda ,expRegular,desde) {
    
    return new Promise((resolve,reject) => {

        Medico.find({nombre: expRegular}, (err,medicos) => {
            if (err) {
                reject('Error al buscar medicos', err);
            } else {
                resolve(medicos);
            }
        }).populate('usuario','nombre email').populate('hospital', 'nombre').skip(desde).limit(4);
    });
}

function buscarUsuarios( busqueda ,expRegular,desde) {
    
    return new Promise((resolve,reject) => {

        Usuario.find({}, 'nombre email role').skip(desde).limit(4).or([{'nombre':expRegular},{'email':expRegular}])
                      .exec((err,usuarios) => {
                            if (err) {
                                reject('Error al buscar usuarios', err);
                            } else {
                                resolve(usuarios);
                            }
                      });
        });

        /*
        Usuario.find({nombre: expRegular}, (err,usuarios) => {
            if (err) {
                reject('Error al buscar usuarios', err);
            } else {
                resolve(usuarios);
            }
        });
        */
};




// Exportar Modulo
module.exports = app;