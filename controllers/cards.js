const Card = require("../models/card");
const NotFoundError = require("../middleware/not-found-err");
//const { handleOrFail } = require("../utils/handleOfFail");

/*
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};
*/

module.exports.getCardsMe = (req, res, next) => {
  Card.find({ owner: req.user._id })
    .populate("owner", "_id name avatar")
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate("owner", "_id name avatar about")
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.getCardsUser = (req, res, next) => {
  Card.find({ owner: req.params.userId })
    .populate("owner", "_id name avatar")
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name: name, link: link, owner: req.user._id })
    /*
  .then((card) => card.populate("owner", "_id name avatar"))
    .then((card) => {
      res.status(200).send(card);
    })
      */
    .then(() =>
      res.status(200).send({ message: "La tarjeta se creó correctamente" })
    )
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.likeByIdCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    {
      new: true, // el controlador then recibe la entrada actualizada como entrada
      runValidators: true, // los datos serán validados antes de la actualización
      upsert: false, // si la entrada de card no fue encontrada, será creada si es true en este caso establecí false
    }
  )
    //.orFail(handleOrFail("No se pudo dar like a la tarjeta"))
    .orFail(() => {
      throw new NotFoundError("No se pudo dar like a la tarjeta");
    })
    .then((card) => {
      //res.status(200).send({ card });
      res.status(200).send(card.likes);
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.dislikeByIdCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
    {
      new: true, // el controlador then recibe la entrada actualizada como entrada
      runValidators: true, // los datos serán validados antes de la actualización
      upsert: false, // si la entrada de card no fue encontrada, será creada si es true en este caso establecí false
    }
  )
    //.orFail(handleOrFail("No se pudo dar dislike a la tarjeta"))
    .orFail(() => {
      throw new NotFoundError("No se pudo dar dislike a la tarjeta");
    })
    .then((card) => {
      //res.status(200).send(card);
      res.status(200).send(card.likes);
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId) //NOTA USE findByIdAndDelete en lugar de findByIdAndRemove ya que me salia TypeError: Card.findByIdAndRemove is not a function
    //.orFail(handleOrFail("No se pudo eliminar la card"))
    .orFail(() => {
      throw new NotFoundError("No se pudo eliminar la card");
    })
    .then(() =>
      res.status(200).send({ message: "La tarjeta se eliminó correctamente" })
    )
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};
