const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Función para registrar un nuevo usuario
exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res
        .status(400)
        .json({ mensaje: "El usuario ya existe con este correo" });
    }

    // Crear instancia del nuevo usuario
    usuario = new Usuario({ nombre, email, password });

    // Encriptar la contraseña antes de guardarla (Salt de 10 rondas)
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    // Guardar en la base de datos
    await usuario.save();
    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error en el servidor al registrar usuario" });
  }
};

// Función para iniciar sesión y generar el JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar que el usuario exista
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    // Comparar la contraseña ingresada con el hash de la base de datos
    const esMatch = await bcrypt.compare(password, usuario.password);
    if (!esMatch) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    // Generar el Payload del JWT con el ID del usuario
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    // Firmar el token con la clave secreta de tu archivo .env
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // El token expira en 1 hora por seguridad
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
  }
};
