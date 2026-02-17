const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");

// Datos de prueba
const usuarioPrueba = {
  nombre: "Test User",
  email: "test@correo.com",
  password: "password123",
};

describe("Pruebas de Autenticación", () => {
  // Antes de todas las pruebas, limpiamos la base de datos de usuarios de prueba
  beforeAll(async () => {
    await Usuario.deleteMany({ email: usuarioPrueba.email });
  });

  // Después de todas las pruebas, cerramos la conexión a Mongoose
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/registrar", () => {
    it("Debería registrar un usuario correctamente y devolver status 201", async () => {
      const res = await request(app)
        .post("/api/auth/registrar")
        .send(usuarioPrueba);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty(
        "mensaje",
        "Usuario registrado exitosamente",
      );
    });

    it("Debería fallar si el usuario ya existe", async () => {
      const res = await request(app)
        .post("/api/auth/registrar")
        .send(usuarioPrueba);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "mensaje",
        "El usuario ya existe con este correo",
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("Debería iniciar sesión correctamente y devolver un token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: usuarioPrueba.email,
        password: usuarioPrueba.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    // AQUÍ FALTA UN CASO DE PRUEBA (Tu ajuste manual)
    it("Debería fallar si la contraseña es incorrecta", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: usuarioPrueba.email,
        password: "passwordEquivocada",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("mensaje", "Credenciales inválidas");
    });
  });
});
