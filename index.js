// Importación de librerías
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Inicialización de la aplicación
const app = express();

// Middlewares globales
app.use(express.json()); // Permite que el servidor reciba y entienda datos en formato JSON

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

// Conexión a la base de datos MongoDB usando Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((error) =>
    console.error("Error crítico al conectar a la base de datos:", error),
  );

// Rutas de la API
app.use("/api/auth", require("./routes/auth"));

app.use("/api/productos", require("./routes/productos"));

// Ruta de prueba básica
app.get("/", (req, res) => {
  res.send("Servidor de Gestión de Productos Activo");
});

// Inicialización del servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
}

module.exports = app;
