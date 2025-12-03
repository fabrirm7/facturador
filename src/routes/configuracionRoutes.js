const express = require("express");
const router = express.Router();
const {
  obtenerConfiguracion,
  guardarConfiguracion,
} = require("../controllers/configuracionController");

router.get("/", obtenerConfiguracion);
router.put("/", guardarConfiguracion);

module.exports = router;
