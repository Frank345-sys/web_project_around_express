module.exports.errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .send({ message: "La solicitud contiene datos inválidos" });
  }
  if (err.name === "CastError") {
    return res.status(400).send({ message: "ID inválido" });
  }
  if (err.statusCode === 404) {
    return res
      .status(404)
      .send({ message: "Recurso solicitado no encontrado" });
  }
  return res
    .status(500)
    .send({ message: "Error interno del servidor: " + err });
};
