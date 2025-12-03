// src/controllers/reportesController.js
const Factura = require("../models/factura");

// GET /api/reportes/resumen?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
const resumenVentas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    // Rango de fechas
    const hoy = new Date();
    const inicioPorDefecto = new Date(hoy);
    inicioPorDefecto.setDate(hoy.getDate() - 6); // últimos 7 días
    inicioPorDefecto.setHours(0, 0, 0, 0);

    const finPorDefecto = new Date(hoy);
    finPorDefecto.setHours(23, 59, 59, 999);

    const inicio = desde
      ? new Date(desde + "T00:00:00")
      : inicioPorDefecto;
    const fin = hasta
      ? new Date(hasta + "T23:59:59")
      : finPorDefecto;

    // Traemos las facturas del rango, con productos
    const facturas = await Factura.find({
      fecha: { $gte: inicio, $lte: fin },
    })
      .populate("cliente", "nombre")
      .populate("productos.producto", "nombre precio");

    let totalFacturado = 0;
    let totalAnuladas = 0;
    let cantidadActivas = 0;
    let cantidadAnuladas = 0;

    const ventasPorDiaMap = {};
    const topProductosMap = {};

    for (const f of facturas) {
      const esActiva = f.estado !== "anulada";

      if (esActiva) {
        totalFacturado += f.total;
        cantidadActivas++;
      } else {
        totalAnuladas += f.total;
        cantidadAnuladas++;
      }

      // 🔹 ventas por día
      const fechaKey = f.fecha.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!ventasPorDiaMap[fechaKey]) {
        ventasPorDiaMap[fechaKey] = 0;
      }
      if (esActiva) {
        ventasPorDiaMap[fechaKey] += f.total;
      }

      // 🔹 top productos
      for (const item of f.productos || []) {
        const esManual = item.esManual || !item.producto;
        const nombreProd = esManual
          ? item.descripcion || "Producto manual"
          : item.producto?.nombre || "Producto";

        const cantidad = item.cantidad || 1;
        const precioUnit = esManual
          ? item.precioUnitario || 0
          : item.producto?.precio || 0;
        const totalItem = cantidad * precioUnit;

        if (!topProductosMap[nombreProd]) {
          topProductosMap[nombreProd] = {
            nombre: nombreProd,
            cantidad: 0,
            total: 0,
          };
        }
        if (esActiva) {
          topProductosMap[nombreProd].cantidad += cantidad;
          topProductosMap[nombreProd].total += totalItem;
        }
      }
    }

    const ventasPorDia = Object.entries(ventasPorDiaMap)
      .map(([fecha, total]) => ({ fecha, total }))
      .sort((a, b) => (a.fecha < b.fecha ? -1 : 1));

    const topProductos = Object.values(topProductosMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    res.json({
      rango: {
        desde: inicio,
        hasta: fin,
      },
      totalFacturado,
      totalAnuladas,
      cantidadFacturas: facturas.length,
      cantidadActivas,
      cantidadAnuladas,
      ventasPorDia,
      topProductos,
    });
  } catch (error) {
    console.error("Error en resumen de ventas:", error);
    res.status(500).json({ message: "Error al obtener el resumen de ventas" });
  }
};

module.exports = {
  resumenVentas,
};
