const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Se requiere el nombre del usuario"],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, "Se requiere url"],
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);

//NOTA PARA EL REVISOR!!!

/*
  Esta expresión regular es la que utilicé --> /(https?:\/\/)(w{3}\.)?(?!ww\.)(?!w\.)[\w._~:\/?%#[\]@!$&'()*+,;=-]+\/?/

  Utilicé esta expresión para validar las urls de la manera que se solicito para la entrega del proyecto
  para los schema user y schema card, además niega que las urls que tengan ww. o w. solo las valida si tiene las www.
  o si no las tiene por completo.

  aqui dejo emplos de como lo verifiqué

      console.log("Prueba 1: " + exp.test("https://w.example.com/")); //false
      console.log("Prueba 2: " + exp.test("https://ww.example.com/")); //false
      console.log("Prueba 3: " + exp.test("https://www.example.com/")); //true
      console.log("Prueba 4: " + exp.test("https://wwwexample.com/")); //true
      console.log("Prueba 5: " + exp.test("http://1-example.com")); //true
      console.log("Prueba 6: " + exp.test("http://example.com/go/even/deeper/")); //true
      console.log("Prueba 7: " + exp.test("http://example-example-example.com")); //true
      console.log(
        "Prueba 8: " +
          exp.test(
            "https://cdna.artstation.com/p/assets/images/images/053/132/838/large/ravi-singh-for-artstation.jpg"
          )
      );

  Pero también formule esta expresión regular --> /(https?:\/\/)(w{3}\.)?(?!ww\.)(?!w\.)[\w._~:\/?%#[\]@!$&'()*+,;=-]+(\.(jpeg|jpg|png|gif|svg|webp|bmp))\/?/


  Cumple con lo antes mencionado, pero valida si la url termina en algún formato /.jpg /.png /.gif, etc.

        console.log(
        "Prueba 9: " +
          exp2.test(
            "https://cdna.artstation.com/p/assets/images/images/053/132/838/large/ravi-singh-for-artstation.jpeg"
          ) // true
      );
*/
