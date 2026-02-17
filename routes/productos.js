const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");
const auth = require("../middleware/authMiddleware");

// api/productos
router.post("/", auth, productoController.crearProducto);
router.get("/", auth, productoController.obtenerProductos);
router.put("/:id", auth, productoController.actualizarProducto);
router.delete("/:id", auth, productoController.eliminarProducto);

module.exports = router;
