const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId, // referencia al cliente
    ref: "Cliente",
    required: true,
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId, // referencia a producto
        ref: "Producto",
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1,
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
