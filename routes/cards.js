const express = require("express");

const cards = express.Router();

const fs = require("fs");

const path = require("path");

const filePath = path.join(__dirname, "../data/cards.json");

//const fileReader = fs.createReadStream(filePath, { encoding: "utf8" });

// Devolvemos todos los usuarios del archivo cards.json
cards.get("/", (req, res) => {
  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: "Error interno del servidor, no se encontro archivo cards.js",
      });
    }
    res.send(data);
  });
});

module.exports = cards;
