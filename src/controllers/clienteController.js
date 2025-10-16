const Cliente = require("../models/cliente");

// 🧩 Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json({ message: "Cliente creado correctamente", cliente: nuevoCliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el cliente", error });
  }
};

// 📋 Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los clientes" });
  }
};

// 🔍 Obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el cliente" });
  }
};

// ✏️ Actualizar un cliente
const actualizarCliente = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // devuelve el cliente actualizado
    });

    if (!clienteActualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente actualizado", cliente: clienteActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};

// 🗑️ Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el cliente" });
  }
};

// Exportamos todas las funciones
module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
};
