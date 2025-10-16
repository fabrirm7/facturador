const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
    },
    precio: {
      type: Number,
      required: true,
      min: 0, // no permite precios negativos
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    categoria: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
