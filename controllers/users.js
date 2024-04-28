const User = require("../models/user");

const { handleOrFail } = require("../utils/handleOfFail");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(handleOrFail("No se pudo obtener el usuario especifico"))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.updateAvatarById = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar },
    {
      new: true, // el controlador then recibe la entrada actualizada como entrada
      runValidators: true, // los datos serán validados antes de la actualización
      upsert: false, // si la entrada de user no fue encontrada, será creada si es true en este caso establecí false
    }
  )
    .orFail(handleOrFail("No se pudo actualizar el avatar"))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.updateUserMeById = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    {
      new: true, // el controlador then recibe la entrada actualizada como entrada
      runValidators: true, // los datos serán validados antes de la actualización
      upsert: false, // si la entrada de user no fue encontrada, será creada si es true en este caso establecí false
    }
  )
    .orFail(handleOrFail("No se pudo actualizar los datos del usuario"))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name: name, about: about, avatar: avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};
