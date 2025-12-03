const mongoose = require("mongoose");

const configuracionSchema = new mongoose.Schema(
  {
    nombreNegocio: { type: String, default: "" },
    direccion: { type: String, default: "" },
    telefono: { type: String, default: "" },
    cuit: { type: String, default: "" },
    imprimirAutomatico: { type: Boolean, default: false },
    numeracionFactura: { type: Number, default: 1 },
    logoUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Configuracion", configuracionSchema);
