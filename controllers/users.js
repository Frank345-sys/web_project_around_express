const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const { handleOrFail } = require("../utils/handleOfFail");
const NotFoundError = require("../middleware/not-found-err");
const { NODE_ENV, JWT_SECRET } = process.env;

/*
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};
*/

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    //.orFail(handleOrFail("No se pudo obtener el usuario especifico"))
    .orFail(() => {
      throw new NotFoundError("No se encontró ningún usuario con ese ID");
    })
    .then((user) => {
      //res.status(200).send({ user });
      res.status(200).send(user);
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
    //.orFail(handleOrFail("No se pudo actualizar el avatar"))
    .orFail(() => {
      throw new NotFoundError("No se pudo actualizar el avatar");
    })
    .then((user) => {
      //res.status(200).send(user);
      res.status(200).send(user);
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
    //.orFail(handleOrFail("No se pudo actualizar los datos del usuario"))
    .orFail(() => {
      throw new NotFoundError("No se pudo actualizar los datos del usuario");
    })
    .then((user) => {
      //const { name, about } = user;
      res.status(200).send(user);
    })
    /*
    .then((user) => {
      res.status(201).send({ _id: user._id, email: user.email });
    })
    */
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

/*
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


module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // no se ha encontrado al usuario con la dirección de correo electrónico indicada
        const error = new Error("Incorrect password or email");
        error.statusCode = 401; // Añadiendo una propiedad statusCode al objeto de error
        return Promise.reject(error);
      }
      // comparando la contraseña enviada y el hash de la base de datos
      return bcrypt.compare(password, user.password);
      // usuario encontrado
    })
    .then((matched) => {
      if (!matched) {
        // los hashes no coinciden, se rechaza el promise
        const error = new Error("Incorrect password or email");
        error.statusCode = 401; // Añadiendo una propiedad statusCode al objeto de error
        return Promise.reject(error);
      }
      // autenticación exitosa
      res.send({ message: "¡Todo bien, Bienvenido!" });
    })
    .catch((err) => {
      next(err); // Pasar el error del if al middleware errorHandler
    });
};
*/

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email: email,
        password: hash, // añadir el hash a la base de datos
      })
    ) /*
    .then(() => {

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(200).send(userWithoutPassword);

    })*/
    .then(() =>
      res.status(200).send({ message: "Usuario creado correctamente" })
    )
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      //¡autenticación exitosa! el usuario está en la variable user
      //res.send({ message: "¡Todo bien, Bienvenido!" });
      //res.status(200).send({ data: user });

      //generamos token
      /*
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
     */
      const token = jwt.sign(
        { _id: user._id }, // Payload del token
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret", // Clave secreta
        { expiresIn: "7d" } // Opcional: establece la duración del token
      );

      // devolvemos el token
      res.status(200).send({ token });
    })
    .catch((err) => {
      next(err); // Pasar el error al middleware errorHandler
    });
};
