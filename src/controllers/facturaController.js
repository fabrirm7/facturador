const Factura = require("../models/factura");
const Cliente = require("../models/cliente");
const Producto = require("../models/producto");

// 🧩 Crear una factura nueva
const crearFactura = async (req, res) => {
  try {
    const { cliente, productos } = req.body;

    // 1️⃣ Verificar si el cliente existe
    const clienteExiste = await Cliente.findById(cliente);
    if (!clienteExiste) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    let total = 0;
    const productosFactura = [];

    // 2️⃣ Recorrer items enviados
    for (const item of productos) {
      // 👉 Caso 1: ÍTEM MANUAL (sin producto de catálogo)
      if (item.esManual) {
        const descripcion = item.descripcion?.trim();
        const precioUnitario = Number(item.precioUnitario);

        if (!descripcion || isNaN(precioUnitario) || precioUnitario < 0) {
          return res.status(400).json({
            message:
              "Datos inválidos en producto manual (descripcion / precioUnitario).",
          });
        }

        total += precioUnitario * item.cantidad;

        productosFactura.push({
          producto: null,
          cantidad: item.cantidad,
          descripcion,
          precioUnitario,
          esManual: true,
        });

        continue;
      }

      // 👉 Caso 2: Producto normal del catálogo
      const productoDB = await Producto.findById(item.producto);
      if (!productoDB) {
        return res
          .status(404)
          .json({ message: `Producto ${item.producto} no encontrado` });
      }

      // 🚫 Validar cantidad y stock disponible
      if (item.cantidad <= 0) {
        return res.status(400).json({
          message: `La cantidad del producto ${productoDB.nombre} debe ser mayor que 0.`,
        });
      }

      if (productoDB.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para ${productoDB.nombre}. Disponible: ${productoDB.stock}, solicitado: ${item.cantidad}.`,
        });
      }

      // ✅ Descontar stock y calcular subtotal
      const subtotal = productoDB.precio * item.cantidad;
      total += subtotal;
      productoDB.stock -= item.cantidad;
      await productoDB.save();

      productosFactura.push({
        producto: productoDB._id,
        cantidad: item.cantidad,
        descripcion: productoDB.nombre,
        precioUnitario: productoDB.precio,
        esManual: false,
      });
    }

    // 3️⃣ Crear la factura
    const nuevaFactura = new Factura({
      cliente,
      productos: productosFactura,
      total,
    });

    await nuevaFactura.save();

    res.status(201).json({
      message: "Factura creada y stock actualizado correctamente ✅",
      factura: nuevaFactura,
    });
  } catch (error) {
    console.error("Error al crear factura:", error);
    res.status(500).json({ message: "Error al crear la factura", error });
  }
};

// 📋 Obtener todas las facturas
const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find()
      .populate("cliente", "nombre email")
      .populate("productos.producto", "nombre precio");
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
};

// 🔍 Obtener una factura por ID
const obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id)
      .populate("cliente")
      .populate("productos.producto");
    if (!factura) return res.status(404).json({ message: "Factura no encontrada" });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la factura", error });
  }
};

// ✏️ Actualizar una factura (ajustando stock anterior y nuevo)
const actualizarFactura = async (req, res) => {
  try {
    const { cliente, productos } = req.body;
    const facturaId = req.params.id;

    // 1️⃣ Buscar la factura original
    const facturaOriginal = await Factura.findById(facturaId).populate(
      "productos.producto"
    );
    if (!facturaOriginal) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    // 2️⃣ Devolver stock de los productos originales (solo los que NO son manuales)
    for (const item of facturaOriginal.productos) {
      if (!item.producto) continue; // manual, no toca stock

      const productoDB = await Producto.findById(item.producto._id);
      if (productoDB) {
        productoDB.stock += item.cantidad; // devolvemos stock anterior
        await productoDB.save();
      }
    }

    // 3️⃣ Calcular nuevo total y ajustar stock
    let nuevoTotal = 0;
    const productosFactura = [];

    for (const item of productos) {
      // Ítem manual
      if (item.esManual) {
        const descripcion = item.descripcion?.trim();
        const precioUnitario = Number(item.precioUnitario);

        if (!descripcion || isNaN(precioUnitario) || precioUnitario < 0) {
          return res.status(400).json({
            message:
              "Datos inválidos en producto manual (descripcion / precioUnitario).",
          });
        }

        nuevoTotal += precioUnitario * item.cantidad;

        productosFactura.push({
          producto: null,
          cantidad: item.cantidad,
          descripcion,
          precioUnitario,
          esManual: true,
        });

        continue;
      }

      // Producto normal
      const productoDB = await Producto.findById(item.producto);
      if (!productoDB) {
        return res
          .status(404)
          .json({ message: `Producto ${item.producto} no encontrado` });
      }

      if (item.cantidad <= 0) {
        return res.status(400).json({
          message: `La cantidad del producto ${productoDB.nombre} debe ser mayor que 0.`,
        });
      }

      if (productoDB.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para ${productoDB.nombre}. Disponible: ${productoDB.stock}, solicitado: ${item.cantidad}.`,
        });
      }

      nuevoTotal += productoDB.precio * item.cantidad;
      productoDB.stock -= item.cantidad;
      await productoDB.save();

      productosFactura.push({
        producto: productoDB._id,
        cantidad: item.cantidad,
        descripcion: productoDB.nombre,
        precioUnitario: productoDB.precio,
        esManual: false,
      });
    }

    // 4️⃣ Actualizar factura
    const facturaActualizada = await Factura.findByIdAndUpdate(
      facturaId,
      { cliente, productos: productosFactura, total: nuevoTotal },
      { new: true }
    );

    res.json({
      message: "Factura actualizada y stock ajustado correctamente ✅",
      factura: facturaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar factura:", error);
    res.status(500).json({ message: "Error al actualizar la factura", error });
  }
};

// 🔄 Anular una factura y devolver stock
const anularFactura = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id).populate(
      "productos.producto"
    );
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    if (factura.estado === "anulada") {
      return res.status(400).json({ message: "La factura ya está anulada." });
    }

    // Devolver el stock de los productos (solo los que no son manuales)
    for (const item of factura.productos) {
      if (!item.producto) continue;

      const productoDB = await Producto.findById(item.producto._id);
      if (productoDB) {
        productoDB.stock += item.cantidad;
        await productoDB.save();
      }
    }

    factura.estado = "anulada";
    await factura.save();

    res.json({ message: "Factura anulada y stock restituido correctamente ✅" });
  } catch (error) {
    console.error("Error al anular factura:", error);
    res.status(500).json({ message: "Error al anular la factura", error });
  }
};

module.exports = {
  crearFactura,
  obtenerFacturas,
  obtenerFacturaPorId,
  actualizarFactura,
  anularFactura,
};
