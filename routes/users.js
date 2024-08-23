const express = require("express");

const users = express.Router();

const {
  getUser,
  getUsers,
  getUserById,
  updateUserMeById,
  updateAvatarById,
} = require("../controllers/users");

const validator = require("validator");

const { celebrate, Joi } = require("celebrate");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

//const fs = require("fs");

//const path = require("path");

//const filePath = path.join(__dirname, "..", "data", "users.json");

// Devolvemos el usuario con el ID ingresado que coincide con el ID del archivo users.json

/*users.get("/:_id", (req, res) => {
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
    } else {
      res.send(user);
    }
  });
});*/

// Devolvemos todos los usuarios del archivo users.json
/*
users.get("/", (req, res) => {
  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: "Error interno del servidor, no se encontro archivo users.js",
      });
    }
    const allUsers = JSON.parse(data);
    res.send(allUsers);
  });
});
*/

// seleccionar todos los usuarios
//users.get("/", getUsers);

// seleccionar usuario
users.get("/me", getUserById);
/*
// seleccionar usuario por id
users.get(
  "/me/:_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
);
*/

// actualizar name y about del usuario por id
users.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      about: Joi.string().required(),
    }),
  }),
  updateUserMeById
);

// actualizar solo el avatar del ususario por id
users.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validateURL).required(),
    }),
  }),
  updateAvatarById
);

module.exports = users;
