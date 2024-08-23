const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jacques Cousteau",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Explorador",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
    validate: {
      // función para validar la URL
      validator(v) {
        return /(https?:\/\/)(w{3}\.)?(?!ww\.)(?!w\.)[\w._~:\/?%#[\]@!$&'()*+,;=-]+\/?/.test(
          v
        );
      },
      message: "La URL ingresada no cumple con los parametros establecidos",
    },
  },
  /*
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      // función para validar la URL
      validator(v) {
        return /(https?:\/\/)(w{3}\.)?(?!ww\.)(?!w\.)[\w._~:\/?%#[\]@!$&'()*+,;=-]+\/?/.test(
          v
        );
      },
      message: "La URL ingresada no cumple con los parametros establecidos",
    },
  },
  */
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // función para validar el email
      validator: validator.isEmail,
      message: "El correo ingresado no cumple con los parametros establecidos",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  //vacio
  // tratando de encontrar al usuario según su correo electrónico
  return this.findOne({ email })
    .select("+password") // this — el modelo de User
    .then((user) => {
      // no encontrado - se rechaza el promise
      if (!user) {
        const error = new Error("Incorrect password or email");
        error.statusCode = 401; // Añadiendo una propiedad statusCode al objeto de error
        return Promise.reject(error);
      }
      // encontrado - comparando hashes
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Incorrect password or email");
          error.statusCode = 401; // Añadiendo una propiedad statusCode al objeto de error
          return Promise.reject(error);
        }
        return user; // ahora user está disponible
      });
    });
};

module.exports = mongoose.model("user", userSchema);
