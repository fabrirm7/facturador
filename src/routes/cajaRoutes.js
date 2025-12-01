const express = require("express");
const router = express.Router();
const {
  abrirCaja,
  obtenerCajaActual,
  cerrarCaja,
  obtenerHistorialCaja,
} = require("../controllers/cajaController");

// Abrir caja
router.post("/abrir", abrirCaja);

// Ver caja actual abierta
router.get("/actual", obtenerCajaActual);

// Historial de cajas
router.get("/historial", obtenerHistorialCaja);

// Cerrar caja
router.post("/cerrar/:id", cerrarCaja);

module.exports = router;
