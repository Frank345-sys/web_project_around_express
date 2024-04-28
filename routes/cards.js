const express = require("express");

const cards = express.Router();

const {
  getCards,
  createCard,
  likeByIdCard,
  dislikeByIdCard,
  deleteCardById,
} = require("../controllers/cards");

/*
const fs = require("fs");

const path = require("path");

const filePath = path.join(__dirname, "..", "data", "cards.json");

// Devolvemos todos los usuarios del archivo cards.json
cards.get("/", (req, res) => {
  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: "Error interno del servidor, no se encontro archivo cards.js",
      });
    }
    const allCards = JSON.parse(data);
    res.send(allCards);
  });
});

cards.post("/", (req, res) => {
  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: "Error interno del servidor, no se encontro archivo cards.js",
      });
    }
    const allCards = JSON.parse(data);
    res.send(allCards);
  });
});

cards.delete("/", (req, res) => {
  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: "Error interno del servidor, no se encontro archivo cards.js",
      });
    }
    const allCards = JSON.parse(data);
    res.send(allCards);
  });
});


*/
// devuelve todas las tarjetas
cards.get("/", getCards);

// crea una nueva tarjeta
cards.post("/", createCard);

// dar like a una tarjeta
cards.put("/:cardId/like", likeByIdCard);

// dar unlike a una tarjeta
cards.delete("/:cardId/like", dislikeByIdCard);

// elimina una tarjeta por cardId
cards.delete("/:cardId", deleteCardById);

module.exports = cards;
