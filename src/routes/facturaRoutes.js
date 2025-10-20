const express = require("express");
const router = express.Router();
const { crearFactura, obtenerFacturas, obtenerFacturaPorId, actualizarFactura } = require("../controllers/facturaController");

router.post("/", crearFactura);
router.get("/", obtenerFacturas);
router.get("/:id", obtenerFacturaPorId);
router.put("/:id", actualizarFactura);

module.exports = router;
