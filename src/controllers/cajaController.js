const Caja = require("../models/caja");
const Factura = require("../models/factura");

// 🟢 Abrir caja
const abrirCaja = async (req, res) => {
  try {
    const { montoInicial } = req.body;

    if (montoInicial == null || isNaN(Number(montoInicial))) {
      return res.status(400).json({ message: "Monto inicial inválido" });
    }

    // Verificar si ya hay una caja abierta
    const cajaAbierta = await Caja.findOne({ estado: "abierta" });
    if (cajaAbierta) {
      return res
        .status(400)
        .json({ message: "Ya hay una caja abierta. Debes cerrarla primero." });
    }

    const nuevaCaja = new Caja({
      montoInicial: Number(montoInicial),
    });

    await nuevaCaja.save();
    res.status(201).json({
      message: "Caja abierta correctamente",
      caja: nuevaCaja,
    });
  } catch (error) {
    console.error("Error al abrir caja:", error);
    res.status(500).json({ message: "Error al abrir la caja" });
  }
};

// 🔍 Obtener caja actual (abierta) con resumen
const obtenerCajaActual = async (req, res) => {
  try {
    const caja = await Caja.findOne({ estado: "abierta" }).sort({
      fechaApertura: -1,
    });

    if (!caja) {
      return res.status(404).json({ message: "No hay caja abierta" });
    }

    // Sumar total de facturas activas desde la apertura
    const [resultado] = await Factura.aggregate([
      {
        $match: {
          fecha: { $gte: caja.fechaApertura },
          estado: "activa",
        },
      },
      {
        $group: {
          _id: null,
          totalVentas: { $sum: "$total" },
        },
      },
    ]);

    const totalVentas = resultado?.totalVentas || 0;
    const totalEsperado = caja.montoInicial + totalVentas;

    res.json({
      caja,
      totalVentas,
      totalEsperado,
    });
  } catch (error) {
    console.error("Error al obtener caja actual:", error);
    res.status(500).json({ message: "Error al obtener la caja actual" });
  }
};

// 🔴 Cerrar caja
const cerrarCaja = async (req, res) => {
  try {
    const { id } = req.params;
    const { montoCierre } = req.body;

    if (montoCierre == null || isNaN(Number(montoCierre))) {
      return res.status(400).json({ message: "Monto de cierre inválido" });
    }

    const caja = await Caja.findById(id);
    if (!caja) {
      return res.status(404).json({ message: "Caja no encontrada" });
    }

    if (caja.estado === "cerrada") {
      return res.status(400).json({ message: "La caja ya está cerrada" });
    }

    // Calcular ventas desde la apertura hasta ahora
    const [resultado] = await Factura.aggregate([
      {
        $match: {
          fecha: { $gte: caja.fechaApertura },
          estado: "activa",
        },
      },
      {
        $group: {
          _id: null,
          totalVentas: { $sum: "$total" },
        },
      },
    ]);

    const totalVentas = resultado?.totalVentas || 0;
    const totalEsperado = caja.montoInicial + totalVentas;
    const cierreNum = Number(montoCierre);
    const diferencia = cierreNum - totalEsperado;

    caja.fechaCierre = new Date();
    caja.montoCierre = cierreNum;
    caja.totalVentas = totalVentas;
    caja.totalEsperado = totalEsperado;
    caja.diferencia = diferencia;
    caja.estado = "cerrada";

    await caja.save();

    res.json({
      message: "Caja cerrada correctamente",
      caja,
    });
  } catch (error) {
    console.error("Error al cerrar caja:", error);
    res.status(500).json({ message: "Error al cerrar la caja" });
  }
};

// 📜 Historial de cajas (todas, ordenadas de la más nueva a la más vieja)
const obtenerHistorialCaja = async (req, res) => {
  try {
    const cajas = await Caja.find().sort({ fechaApertura: -1 });
    res.json(cajas);
  } catch (error) {
    console.error("Error al obtener historial de caja:", error);
    res.status(500).json({ message: "Error al obtener el historial de caja" });
  }
};

module.exports = {
  abrirCaja,
  obtenerCajaActual,
  cerrarCaja,
  obtenerHistorialCaja,
};
