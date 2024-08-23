const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // obtener la autorización del encabezado
  const { authorization } = req.headers;

  const handleAuthError = (res) => {
    res.status(401).send({ message: "Error de autorización" });
  };

  // comprobemos que el encabezado existe y comienza con 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  // obtener el token
  const extractBearerToken = (header) => {
    return header.replace("Bearer ", "");
  };

  const token = extractBearerToken(authorization);
  // verificando el token

  let payload;

  try {
    // tratando de verificar el token
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    // devolvemos un error si algo va mal
    console.error("JWT verification error:", err);
    return res.status(401).send({ message: "Se requiere autorización" });
  }

  req.user = payload; // asigna el payload al objeto de solicitud

  next(); // envía la solicitud al siguiente middleware
};
