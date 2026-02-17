const Producto = require("../models/Producto");

// CREAR un producto (C)
exports.crearProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    // Asignamos el ID del usuario autenticado como creador del producto
    producto.creadoPor = req.usuario.id;

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el producto" });
  }
};

// LEER todos los productos (R)
exports.obtenerProductos = async (req, res) => {
  try {
    // Buscamos los productos. .populate() nos permite traer los datos del usuario creador si lo necesitamos
    const productos = await Producto.find().populate(
      "creadoPor",
      "nombre email",
    );
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los productos" });
  }
};

// ACTUALIZAR un producto (U)
exports.actualizarProducto = async (req, res) => {
  try {
    const { nombre, tipo, precio, descripcion } = req.body;
    let producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Verificamos que el usuario que intenta actualizar sea el mismo que lo creó
    if (producto.creadoPor.toString() !== req.usuario.id) {
      return res
        .status(401)
        .json({ mensaje: "No autorizado para editar este producto" });
    }

    // Actualizamos usando Mongoose
    producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, tipo, precio, descripcion },
      { new: true }, // Devuelve el documento actualizado
    );

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el producto" });
  }
};

// ELIMINAR un producto (D)
exports.eliminarProducto = async (req, res) => {
  try {
    let producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Verificamos que el usuario que intenta eliminar sea el mismo que lo creó
    if (producto.creadoPor.toString() !== req.usuario.id) {
      return res
        .status(401)
        .json({ mensaje: "No autorizado para eliminar este producto" });
    }

    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el producto" });
  }
};
