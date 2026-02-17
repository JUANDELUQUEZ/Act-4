const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Ruta para registrar usuario: POST /api/auth/registrar
router.post("/registrar", authController.registrar);

// Ruta para iniciar sesión: POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
