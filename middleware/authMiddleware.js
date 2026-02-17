const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Leer el token del header (usaremos una cabecera personalizada llamada x-auth-token)
  const token = req.header("x-auth-token");

  // 2. Revisar si no hay token
  if (!token) {
    return res.status(401).json({ mensaje: "No hay token, permiso denegado" });
  }

  // 3. Validar el token
  try {
    // jwt.verify descifra el token usando tu firma secreta
    const cifrado = jwt.verify(token, process.env.JWT_SECRET);

    // Extraemos el payload del usuario y lo inyectamos en el objeto request (req)
    req.usuario = cifrado.usuario;

    // next() le dice a Express que continúe con la siguiente función (el controlador)
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token no válido" });
  }
};
