const express = require("express");

const cards = express.Router();

const {
  getCardsMe,
  getAllCards,
  getCardsUser,
  createCard,
  likeByIdCard,
  dislikeByIdCard,
  deleteCardById,
} = require("../controllers/cards");

const validator = require("validator");

const { celebrate, Joi } = require("celebrate");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

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
// devuelve solo las targetas del usuario visitado
cards.get(
  "/user/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getCardsUser
);

// devuelve solo las targetas del usuario
cards.get("/me", getCardsMe);

// devuelve todas las tarjetas de todos los usuarios
cards.get("/", getAllCards);

// crea una nueva tarjeta
cards.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      link: Joi.string().custom(validateURL).required(),
    }),
  }),
  createCard
);

// dar like a una tarjeta
cards.put(
  "/like/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeByIdCard
);

// dar unlike a una tarjeta
cards.delete(
  "/like/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeByIdCard
);

// elimina una tarjeta por cardId
cards.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCardById
);

module.exports = cards;
