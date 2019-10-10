var express = require('express');
var mdwareAutenticacion = require('../middlewares/autenticacion');

var app = express();

// Importar modelos
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');


//=============================================================================================
// Metodo Obtener todos los usuarios
//=============================================================================================

app.get('/', (req, res) => {
    var body = req.body;
// paramatro opcional para leerlo desde la url
    var desde = req.query.desde || 0;
        desde = Number(desde);
  console.log('desde: ', desde);

    Hospital.find({}, (err,hospitales) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando Hospitales",
                errors: err
            });
        }
        
        // Poner un contador para saber cuanto hospitales tenemos
        // Hospital.count({}) cuantalos todos
        Hospital.count({},(err,conteo) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error contando hospitales",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: "Hospitales",
                hospitales: hospitales,
                body:body,
                totalHospitales:conteo
            });

        });
    // }).populate(tabla o coleccion, campos de la coleccion); indica que tablas y campos quieren que se muestre en la data de un campo de la data principal
    }).populate('usuario', 'nombre email').skip(desde).limit(4);

});

//=============================================================================================
// Metodo de Crear/Ingresar un  Hospital a la bd  
//=============================================================================================

app.post('/', mdwareAutenticacion ,(req,res) => {
    var body = req.body;
    var usuario = Usuario._id; //id del usuario

    var hospital = new Hospital({
        nombre: body.nombre,
        // usuario: Usuario._id       
        // usuario: Usuario._id 
        usuario: body.usuario, //id del usuario  
        // usuario: req.usuario._id     
    });

    hospital.save((err,hospitalGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error crear Hospital",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: "Hospitales",
            hospitalGuardado: hospitalGuardado,
            usuarioToken: req.usuarioBdLogin,
            body: body
        });
    });

});


//=============================================================================================
// Metodo de Hospital un usuario en la bd  
//=============================================================================================

app.put('/:id',mdwareAutenticacion, (req,res) => {
    var id = req.params.id;
    var rekuest= req.params;
    var body = req.body;
    // var parametros= req.params;
    // var solicitud= req;
    // console.log('solicitud: ', solicitud);
   
    Hospital.findById(id, (err,hospitalId) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al Hospital no encontrado",
                errors: err
            });
        }

        if (!hospitalId) {
            return res.status(400).json({
                ok: false,
                mensaje: "El Hospital con el " + id + "no existe",
                // errors: err
                errors: { message: 'No existe un Hospital con ese ID' }
            });
        }

        hospitalId.nombre = body.nombre;
        // hospitalId.usuario = Usuario._id;  
        // hospitalId.usuario = Usuario._id;
        // hospitalId.usuario = Usuario._id;  
        hospitalId.usuario = body.usuario; //id del usuario
        
        
        hospitalId.save((err,hospitalGuardadoId) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar Hospital",
                    errors: { message: 'error al actualizar hospital con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                hospitalGuardadoId: hospitalGuardadoId,
                usuarioToken: req.usuarioBdLogin
            });
        });
        
    });
});

//=============================================================================================
// Metodo de borrar un usuario en la bd  
//=============================================================================================

app.delete('/:id',mdwareAutenticacion, (req,res) => {
    
    var id = req.params.id;
    var body = req.params;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar hospital",
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "El hospital con el " + id + "no existe",
                // errors: err
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            hospitalBorrado: hospitalBorrado,
            usuarioToken: req.usuarioBdLogin
        });
    });
});


// Exportar Modulo
module.exports = app;


















































































































































































































/*




// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');

// Utenticacion
var mdwareAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

// Importar modelo de usuario
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');


//=============================================================================================
// Metodo Obtener todos los hospitales
//=============================================================================================
// app.get('/', (req, res, next) => {

//     Usando mongoDB y esquema de usuario y filtrar por campos
//     Hospital.find({}).exec( (err, hospitales) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: "Error cargando Hospitales",
//                 errors: err
//             })
//         }

//         res.status(200).json({
//             ok: true,
//             mensaje: "Hospitales",
//             hospitales: hospitales
//         })
//         console.log('Res: ', res);
//     });
// });


//=============================================================================================
// Metodo de Crear/Ingresar un  Hospital a la bd  
//=============================================================================================

app.post('/', mdwareAutenticacion ,(req, res) => {
    // console.log('req: ', req);
    var body = req.body; // solo funciona con body parses configurado application/x-www-form-urlencoded
    console.log('body: ', body);

    // Hace referencia al modelo de datos de Usuario
    var hospital = Hospital({
        nombre : body.nombre,
        usuario: Usuario._id
    });

    hospital.save((err,hospitalGuardado) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear hospital",
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            hospitalGuardado: hospitalGuardado,
            body:body
        });
    });
});

//=============================================================================================
// Metodo de actualizar un usuario en la bd  
//=============================================================================================

app.put('/:id', mdwareAutenticacion ,(req,res) => {
    var id = req.params.id;
    var rekuest= req.params;
    var body = req.body;
    
    Hospital.findById(id, (err,hospital)=>{
         
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar hospital",
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: "El hospital con el " + id + "no existe",
                // errors: err
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
       
        
        hospital.save( (err, hospitalguardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar Hospital",
                    errors: err
                });
            }

    
        
            res.status(200).json({
                ok: true,
                rek: rekuest,
                hospitalguardado: hospitalguardado
            });
        });
      
    });
});


//=============================================================================================
// Metodo de borrar un usuario en la bd  
//=============================================================================================

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





*/
