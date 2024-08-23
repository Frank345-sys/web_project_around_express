const express = require("express");

const { errors } = require("celebrate");

const { celebrate, Joi } = require("celebrate");

const cors = require("cors");

const app = express();

const mongoose = require("mongoose");

require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => console.log("conexion exitosa"))
  .catch((err) => console.log("Surgio un error:", err));

const bodyParser = require("body-parser");

const cards = require("./routes/cards");

const users = require("./routes/users");

const { createUser, login } = require("./controllers/users");

const auth = require("./middleware/auth");

const { errorHandler } = require("./middleware/errorHandle");

const { requestLogger, errorLogger } = require("./middleware/logger");

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.options("*", cors());

app.use(requestLogger);

app.use("/users", auth, users);

//prueba
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

//iniciar sesión
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    }),
  }),
  login
);

//crear usuario
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    }),
  }),
  createUser
);

//autorización por ruta, se restringue la ruta /cards
app.use("/cards", auth, cards);

// habilitar el logger de errores
app.use(errorLogger);

// controlador de errores de celebrate
app.use(errors());

/*
utilizo errorHandler en App.js, como middleware global que
para manejar cualquier error en las rutas de users y cards.
*/
app.use(errorHandler);

//nueva forma
/*
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(500).send({ message: "Error interno del servidor: " + err });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
});
app.use((err, req, res, next) => {
  // si un error no tiene estado, se muestra 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // comprueba el estado y muestra un mensaje basado en dicho estado
    message:
      statusCode === 500 ? "Se ha producido un error en el servidor" : message,
  });
});
*/

app.get("/", (req, res) => {
  res.status(500).send({ message: "Recurso solicitado no encontrado" });
});

app.listen(PORT, () => {
  console.log(`Mi aplicación está corriendo en el puerto ${PORT}`);
});
