const express = require("express");

const users = express.Router();

const fs = require("fs");

const path = require("path");

const filePath = path.join(__dirname, "../data/users.json");

//const fileReader = fs.createReadStream(filePath, { encoding: "utf8" });

// Devolvemos el usuario con el ID ingresado que coincide con el ID del archivo users.json
users.get("/:_id", (req, res) => {
  const idCard = req.params._id;

  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: "Error interno del servidor, no se encontro archivo users.js",
      });
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user._id === idCard);

    if (!user) {
      return res.status(404).send({ message: "ID de usuario no encontrado" });
    }

    res.send(user);
  });
});

// Devolvemos todos los usuarios del archivo users.json
users.get("/", (req, res) => {
  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: "Error interno del servidor, no se encontro archivo users.js",
      });
    }
    res.send(data);
  });
});

module.exports = users;
