const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express(); // 🔹 solo una instancia

app.use(
  cors({
    origin: "http://localhost:5173", // permite solo tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middlewares
app.use(express.json());
app.use(bodyParser.json());

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Base de datos conectada"))
  .catch((error) => console.log("❌ Error de conexión a BD:", error));

// Ruta de prueba
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Importamos las rutas
const clienteRoutes = require("./routes/clienteRoutes");
const productoRoutes = require("./routes/productoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");


// Usamos las rutas
app.use("/api/clientes", clienteRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/facturas", facturaRoutes);

// Iniciar servidor
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Servidor corriendo en puerto ${port}`));


