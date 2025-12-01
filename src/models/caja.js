const mongoose = require("mongoose");

const cajaSchema = new mongoose.Schema({
  fechaApertura: {
    type: Date,
    default: Date.now,
  },
  fechaCierre: {
    type: Date,
  },
  montoInicial: {
    type: Number,
    required: true,
    min: 0,
  },
  montoCierre: {
    type: Number,
    default: 0,
  },
  totalVentas: {
    type: Number,
    default: 0,
  },
  totalEsperado: {
    type: Number,
    default: 0,
  },
  diferencia: {
    type: Number,
    default: 0,
  },
  estado: {
    type: String,
    enum: ["abierta", "cerrada"],
    default: "abierta",
  },
});

const Caja = mongoose.model("Caja", cajaSchema);
module.exports = Caja;
