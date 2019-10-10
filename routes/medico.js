  var express = require('express');
var mdwareAutenticacion = require('../middlewares/autenticacion');

var app = express();


// Importar modelos
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');


//=============================================================================================
// Metodo Obtener todos los medicos
//=============================================================================================

app.get('/', (req, res) => {
    // paramatro opcional para leerlo desde la url
    var desde = req.query.desde || 0;
        desde = Number(desde);
        console.log('desde: ', desde);

    Medico.find({}, (err,medicos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando medicos",
                errors: err
            });
        }

        // Poner un contador para saber cuanto Medicos tenemos
        // Medico.count({}) cuantalos todos
        Medico.count({},(err,conteo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error contando Medicos",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: "Medicos",
                medicos: medicos,
                totalMedicos:conteo
            });
        });
    }).populate('usuario', 'nombre email')
      .populate('hospital', 'nombre').skip(desde).limit(4);

});

//=============================================================================================
// Metodo de Crear/Ingresar un  medico a la bd  
//=============================================================================================

app.post('/',mdwareAutenticacion,(req,res) => {
    var body = req.body;
    var usuario = Usuario._id;
    var hospital = Hospital._id

    var medico = new Medico({
        nombre: body.nombre,
        usuario: body.usuario, //id del usuario
        // usuario: req.usuario,
        hospital: body.hospital //id del hospital
        // hospital: body.hospital
    });

    medico.save((err,medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error crear Medico",
                errors: { message: 'Error al crear medico' },
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: "Medicos",
            medicoGuardado: medicoGuardado,
            usuarioToken: req.usuarioBdLogin,
            body: body,
        });
    });

});


//=============================================================================================
// Metodo de Medico un usuario en la bd  
//=============================================================================================

app.put('/:id',mdwareAutenticacion, (req,res) => {
    var id = req.params.id;
    var rekuest= req.params;
    var body = req.body;
    // var parametros= req.params;
    // var solicitud= req;
    // console.log('solicitud: ', solicitud);
   
    Medico.findById(id, (err,medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al medico no encontrado",
                errors: err
            });
        }

        if (!medicoGuardado) {
            return res.status(400).json({
                ok: false,
                mensaje: "El Medico con el " + id + "no existe",
                // errors: err
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medicoGuardado.nombre = body.nombre;
        medicoGuardado.usuario = body.usuario;  
        // medicoGuardado.hospital = Hospital._id; 
        medicoGuardado.hospital = body.hospital;
        // medicoGuardado.hospital = Hospital; 
        
        medicoGuardado.save((err,medicoGuardadoId) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar medico",
                    errors: { message: 'error al actualizar medico con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                medicoGuardadoId: medicoGuardadoId,
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

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar medico",
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "El medico con el " + id + "no existe",
                // errors: err
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            medicoBorrado: medicoBorrado,
            usuarioToken: req.usuarioBdLogin
        });
    });
});

// Exportar Modulo
module.exports = app;



























































































/*


var express = require('express');
var app = express();

// Importar modelos
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');


//=============================================================================================
// Metodo Obtener todos los medicos
//=============================================================================================

app.get('/', (req, res) => {

    var body = req.body;

    Medico.find({}, (err,medicos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando medicos",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "Medicos",
            medicos: medicos,
        });
    });

});

//=============================================================================================
// Metodo de Crear/Ingresar un  Hospital a la bd  
//=============================================================================================

app.post('/', (req,res) => {
    var body = req.body;

    var medico = Medico({
        nombre: body.nombre,
        usuario: Usuario._id,
        hospital: Hospital._id
    });

    medico.save((err,medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error crear Medico",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: "Medicos",
            medicoGuardado: medicoGuardado,
            // usuarioToken: req.usuarioBdLogin,
        });
    });

});



// Exportar Modulo
module.exports = app;

*/