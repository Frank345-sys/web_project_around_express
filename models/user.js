const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("user", userSchema);
