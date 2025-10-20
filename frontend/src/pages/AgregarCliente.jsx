import { useState } from "react";
import { api } from "../api";

export default function AgregarCliente() {
  const [cliente, setCliente] = useState({
    nombre: "",
    cuit: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/clientes", cliente);
      alert("Cliente agregado correctamente ✅");
      setCliente({ nombre: "", cuit: "", email: "", telefono: "", direccion: "" });
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      alert("Hubo un error al agregar el cliente ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agregar Cliente</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input type="text" name="nombre" placeholder="Nombre" value={cliente.nombre} onChange={handleChange} required />
        <input type="text" name="cuit" placeholder="CUIT" value={cliente.cuit} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={cliente.email} onChange={handleChange} required />
        <input type="text" name="telefono" placeholder="Teléfono" value={cliente.telefono} onChange={handleChange} />
        <input type="text" name="direccion" placeholder="Dirección" value={cliente.direccion} onChange={handleChange} />
        <button type="submit" style={{ background: "#282c34", color: "white", padding: "8px", border: "none", cursor: "pointer" }}>
          Guardar Cliente
        </button>
      </form>
    </div>
  );
}
