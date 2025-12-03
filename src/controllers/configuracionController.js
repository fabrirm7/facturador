const Configuracion = require("../models/configuracion");

// GET /api/configuracion
const obtenerConfiguracion = async (req, res) => {
  try {
    const cfg = await Configuracion.findOne();
    if (!cfg) {
      return res.status(404).json({ message: "No hay configuración guardada" });
    }
    res.json(cfg);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener la configuración" });
  }
};

// PUT /api/configuracion
const guardarConfiguracion = async (req, res) => {
  try {
    const datos = {
      nombreNegocio: req.body.nombreNegocio || "",
      direccion: req.body.direccion || "",
      telefono: req.body.telefono || "",
      cuit: req.body.cuit || "",
      imprimirAutomatico: !!req.body.imprimirAutomatico,
      numeracionFactura:
        Number(req.body.numeracionFactura) > 0
          ? Number(req.body.numeracionFactura)
          : 1,
      logoUrl: req.body.logoUrl || "",
    };

    const cfg = await Configuracion.findOneAndUpdate({}, datos, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.json(cfg);
  } catch (error) {
    console.error("Error al guardar configuración:", error);
    res.status(500).json({ message: "Error al guardar la configuración" });
  }
};

module.exports = {
  obtenerConfiguracion,
  guardarConfiguracion,
};
