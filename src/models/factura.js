const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId, // referencia al cliente
    ref: "Cliente",
    required: true,
  },
  productos: [
    {
      // Si es producto del catálogo
      producto: {
        type: mongoose.Schema.Types.ObjectId, // referencia a producto
        ref: "Producto",
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1,
      },

      // Campos extra para soportar ítems manuales
      descripcion: {
        type: String, // nombre del item
      },
      precioUnitario: {
        type: Number, // precio unitario al momento de la venta
      },
      esManual: {
        type: Boolean,
        default: false,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  estado: {
    type: String,
    enum: ["activa", "anulada"], // agregacion para anular factura
    default: "activa",
  },
});

module.exports = mongoose.model("Factura", facturaSchema);
