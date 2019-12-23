// Requires (Importacion de librerias de terceros o personalizadas)
var express = require('express');

// Plugin express-fileupload; para subir archivos
var fileUpload = require('express-fileupload');

// File System
var fileSystem = require('fs');

// Inicializar variables
var app = express();

// Modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// default options Middleware
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var file = req.files;
    var tipoImagen = req.params.tipo;
    var id = req.params.id;
    console.log('file: ', file);
    console.log('tipoImagen: ', tipoImagen);
    console.log('id: ', id);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No selecciono ningun archivo",
            errors: { message: 'Debe seleccionar una imagen' }
        });
    } 

    // Tipos de coleccion
     var tiposDeCollectionValidos = ['hospitales','medicos','usuarios']
        if (tiposDeCollectionValidos.indexOf(tipoImagen) < 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "Tipo de coleccion de imagen no valida",
                errors: {message: "Tipo de coleccion de imagen no valida"}
            });
        }

    // Obtener nombre del archivo
        var archivo = req.files.imagen; //imagen es el nombre que esta en el postman
        var nombreArchivoSeperado =  archivo.name.split('.'); // separar en un arreglo el archivo para tener su extension
        var extensionArchivo = nombreArchivoSeperado[ nombreArchivoSeperado.length - 1]; // obtener la extension del archivo

    // Solo estas extension son permitidas
        var extensionesValidas = ['png','jpg','gif','jpeg'];

        if (extensionesValidas.indexOf(extensionArchivo) < 0 ) { // Si manda un -1 o cualquier otro valor menos a cero manda error
            return res.status(400).json({
                ok: false,
                mensaje: 'Extension no valida',
                errors: {
                    message:  "La extesion agregada no es permitida solo se admiten estas extensiones: " + extensionesValidas.join(', ')
                }
            });
        }


        // Nombre de archivo personalizado
            // idusuario-nroramdom.png nombre de la imagen
        var numeroRamdom = Math.random();
            // var nombreArchivo = `${ id }-${Math.random()}
            // var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;
        var nombreArchivo = `${ id }-${ numeroRamdom }.${extensionArchivo}`;

        // Mover el archivo a un path en especifico
        var path = `./uploads/${tipoImagen}/${nombreArchivo}`;
             archivo.mv(path,(err) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al mover archivo",
                        errors: err
                    });
                }

                subirImagenPorTipo(tipoImagen, id, nombreArchivo, res);               

                // res.status(200).json({
                //     ok: true,
                //     mensaje: "Peticion realizada correctamente y Archivo movido",
                //     nombreArchivoSeperado:nombreArchivoSeperado,
                //     extensionArchivo: extensionArchivo
                // });
             });
});

function subirImagenPorTipo(tipoImagen, id, nombreArchivo, res) {
    
    if (tipoImagen === 'usuarios') {
        Usuario.findById(id, (err,usuario)=>{
            
            if (err) {
               return  res.status(500).json({
                    ok: false,
                    mensaje: "Error al subir Imagen",
                    errors: err
                });
            }

            if (!usuario) {
                return  res.status(500).json({
                     ok: false,
                     mensaje: "Error el usuario con ese id no existe",
                     errors: err
                 });
             }

            var pathViejo = './uploads/usuarios/' + usuario.img; // pathViejo de la imagen si el usuario ya tiene una guardada 

            // Para borrar el path viejo hay q hacer una validacion y se requiere hacer lo siguiente  
            // Se importa una libreria de node filesystem(fs)
            
            if (fileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
                fileSystem.unlink(pathViejo,(err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: "Error en path",
                            errors: err
                        });
                    }
                });
            }

          

            usuario.img = nombreArchivo;
           
            usuario.save((err,usuarioImgGuardada)=>{
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al subir imagen de usuario",
                        errors: err
                    });
                }
                usuarioImgGuardada.password = ':)' ;
                return res.status(200).json({
                    ok: true,
                    mensaje:'Imagen de usuario guardada exitosamente',
                    usuarioImgGuardada:usuarioImgGuardada  
                });

            });
        });    
    }

    if (tipoImagen === 'hospitales') {
        Hospital.findById(id, (err,hospital)=>{
            
            if (err) {
                 res.status(500).json({
                    ok: false,
                    mensaje: "Error al subir Imagen",
                    errors: err
                });
            }
            
            if (!hospital) {
                return  res.status(500).json({
                     ok: false,
                     mensaje: "Error el hospital con ese id no existe",
                     errors: err
                 });
             }
            var pathViejo = './uploads/hospitales/' + hospital.img; // pathViejo de la imagen si el usuario ya tiene una guardada 

            // Para borrar el path viejo hay q hacer una validacion y se requiere hacer lo siguiente  
            // Se importa una libreria de node filesystem(fs)
            
            if (fileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
                fileSystem.unlink(pathViejo,(err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: "Error en path",
                            errors: err
                        });
                    }
                });
            }

            hospital.img = nombreArchivo;
          
            hospital.save((err,hospitalImgGuardada)=>{
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al subir imagen de hospital",
                        errors: err
                    });
                }
                // hospitalImgGuardada.password = ':)' ;
                return res.status(200).json({
                    ok: true,
                    mensaje:'Imagen de hospitales guardada exitosamente',
                    hospitalImgGuardada:hospitalImgGuardada  
                });

            });
        });
    }

    if (tipoImagen === 'medicos') {

        Medico.findById(id, (err,medico)=>{
            
            if (err) {
                 res.status(500).json({
                    ok: false,
                    mensaje: "Error al subir Imagen",
                    errors: err
                });
            }
            
            if (!medico) {
                return  res.status(500).json({
                     ok: false,
                     mensaje: "Error el medico con ese id no existe",
                     errors: err
                 });
             }

            var pathViejo = './uploads/medicos/' + medico.img; // pathViejo de la imagen si el usuario ya tiene una guardada 

            // Para borrar el path viejo hay q hacer una validacion y se requiere hacer lo siguiente  
            // Se importa una libreria de node filesystem(fs)
            
            if (fileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
                fileSystem.unlink(pathViejo,(err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: "Error en path",
                            errors: err
                        });
                    }
                });
            }

            medico.img = nombreArchivo;
            // medico.password = ':)' ;
            medico.save((err,medicoImgGuardada)=>{
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al subir imagen de medico",
                        errors: err
                    });
                }
                // medicoImgGuardada.password = ':)' ;
                return res.status(200).json({
                    ok: true,
                    mensaje:'Imagen de medico guardada exitosamente',
                    medicoImgGuardada:medicoImgGuardada  
                });

            });
        });
        
    }

}


// Exportar Modulo
module.exports = app;

