const express = require("express");
const router = express.Router();
const {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
} = require("../controllers/clienteController");

// 📋 Rutas CRUD para clientes
router.post("/", crearCliente);         // Crear cliente
router.get("/", obtenerClientes);       // Obtener todos los clientes
router.get("/:id", obtenerClientePorId); // Obtener cliente por ID
router.put("/:id", actualizarCliente);  // Actualizar cliente
router.delete("/:id", eliminarCliente); // Eliminar cliente

module.exports = router;
