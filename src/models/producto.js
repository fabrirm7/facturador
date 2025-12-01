const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: String,

  // 👇 ANTES: required: true
  codigo: {
    type: String,
    required: false,   // ⬅️ AHORA NO ES OBLIGATORIO
  },

  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  categoria: {
    type: String,
  },
});

module.exports = mongoose.model("Producto", productoSchema);
