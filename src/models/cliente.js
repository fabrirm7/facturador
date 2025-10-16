const mongoose = require("mongoose");

// Definimos la estructura (schema) del cliente
const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true, // obligatorio
      trim: true, // elimina espacios innecesarios
    },
    cuit: {
      type: String,
      required: true,
      unique: true, // no puede repetirse
    },
    email: {
      type: String,
      required: true,
      lowercase: true, // guarda todo en minúsculas
    },
    telefono: {
      type: String,
      default: "",
    },
    direccion: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

// Creamos el modelo a partir del schema
const Cliente = mongoose.model("Cliente", clienteSchema);

// Exportamos el modelo para poder usarlo en controladores
module.exports = Cliente;
