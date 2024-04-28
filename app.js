const express = require("express");

const app = express();

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => console.log("conexion exitosa"))
  .catch((err) => console.log("Surgio un error:", err));

const bodyParser = require("body-parser");

const cards = require("./routes/cards");

const users = require("./routes/users");

const { errorHandler } = require("./utils/errorHandle");

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: "6629c389dc4b05f71d0c96e8", // ID de mi usuario creado
  };
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", users);

app.use("/cards", cards);

/*
utilizo errorHandler en App.js, como middleware global que
para manejar cualquier error en las rutas de users y cards.
*/
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(500).send({ message: "Recurso solicitado no encontrado" });
});

app.listen(PORT, () => {
  console.log(`Mi aplicación está corriendo en el puerto ${PORT}`);
});
