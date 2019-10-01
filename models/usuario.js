//  Modelos / Modelo

    // Requires (Importacion de librerias de terceros o personalizadas)
    var mongoose = require('mongoose');
    var uniqueValidator = require('mongoose-unique-validator');

    // Realizar un esquema
    var Schema = mongoose.Schema;

    var rolesValidos = {
        values:['ADMIN_ROLE','USER_ROLE'], //valores validos
        message:'{VALUE} no es un rol permitido'
    };

    // Esquema de usuario
    var usuarioSchema = new Schema({
        nombre: { type: String, required: [true,'El nombre es necesario'] },
        email: { type: String, unique:true , required: [true,'El correo es necesario'] },
        password: { type: String, required: [true,'La clave es necesaria'] },
        img: { type: String, required: false },
        role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    });

    // Usar Plugin para validar 
    // usuarioSchema.plugin(uniqueValidator, {message: 'El correo debe ser unico'});
    usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

    // Usar este modulo o esquema afuera 
    module.exports = mongoose.model('Usuario', usuarioSchema);










































