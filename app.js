const express = require("express");

const app = express();

const cards = require("./routes/cards");

const users = require("./routes/users");

const { PORT = 3000 } = process.env;

app.use("/users", users);

app.use("/cards", cards);

app.get("/", (req, res) => {
  res.status(500).send({ message: "Recurso solicitado no encontrado" });
});

app.listen(PORT, () => {
  console.log(`Mi aplicación está corriendo en el puerto ${PORT}`);
});
