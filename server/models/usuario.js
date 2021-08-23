const mongoose = require('mongoose'); //exportar mongoose
const uniqueValidator = require('mongoose-unique-validator'); //exportar unique validator para validar los dartosa si es un email
//roles validos de usuario
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
//creamos el schema
let Schema = mongoose.Schema;
let UsuarioSchema = new Schema({
        nombre: {
            type: String,
            required: [true, 'El nombre es necesario']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'El correo es obligatorio'],


        },
        password: {
            type: String,
            required: [true, 'La contrseña es obligatoria']
        },
        img: {
            type: String,
            required: false
        },
        role: {
            type: String,
            default: 'USER-ROLE',
            enum: rolesValidos
        },
        estado: {
            type: Boolean,
            default: true
        },
        google: {
            type: Boolean,
            default: false
        }
    })
    //para elimar o no mostrar el pasword al ejecutar en el postman 
UsuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
UsuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' }); //validar el email

module.exports = mongoose.model('usuario', UsuarioSchema); //exportar el modulo usuario y utilizarlo en todos lados