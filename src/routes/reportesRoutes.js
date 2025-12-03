// src/routes/reportesRoutes.js
const express = require("express");
const router = express.Router();
const { resumenVentas } = require("../controllers/reportesController");

// GET /api/reportes/resumen
router.get("/resumen", resumenVentas);

module.exports = router;
