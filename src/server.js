const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Base de datos conectada"))
  .catch((error) => console.log(" Error de conexión a BD:", error));


app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));