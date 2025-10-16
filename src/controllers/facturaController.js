const Factura = require("../models/factura");
const Cliente = require("../models/cliente");
const Producto = require("../models/producto");

// Crear una factura nueva
const crearFactura = async (req, res) => {
  try {
    const { cliente, productos } = req.body;

    // Verificar si el cliente existe
    const clienteExiste = await Cliente.findById(cliente);
    if (!clienteExiste) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Calcular el total de la factura
    let total = 0;

    for (const item of productos) {
      const productoDB = await Producto.findById(item.producto);
      if (!productoDB) {
        return res.status(404).json({ message: `Producto ${item.producto} no encontrado` });
      }
      total += productoDB.precio * item.cantidad;
    }

    // Crear y guardar la factura
    const nuevaFactura = new Factura({
      cliente,
      productos,
      total,
    });

    await nuevaFactura.save();

    res.status(201).json({ message: "Factura creada correctamente", factura: nuevaFactura });
  } catch (error) {
    console.error("Error al crear factura:", error);
    res.status(500).json({ message: "Error al crear la factura" });
  }
};

// Obtener todas las facturas
const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find()
      .populate("cliente", "nombre email") // Muestra solo ciertos campos del cliente
      .populate("productos.producto", "nombre precio"); // Igual con producto
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
};

module.exports = { crearFactura, obtenerFacturas };
