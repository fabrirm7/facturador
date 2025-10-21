import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: "",
    cuit: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const res = await api.get(`/clientes/${id}`);
        setCliente(res.data);
      } catch (error) {
        toast.error("❌ Error al cargar el cliente");
      }
    };
    obtenerCliente();
  }, [id]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/clientes/${id}`, cliente);
      toast.success("✅ Cliente actualizado correctamente");
      navigate("/clientes");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);

      } else {
        toast.error("Error al actualizar el cliente ❌");
      }
      
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Editar Cliente</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input type="text" name="cuit" value={cliente.cuit} onChange={handleChange} placeholder="CUIT" required />
        <input type="email" name="email" value={cliente.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="telefono" value={cliente.telefono} onChange={handleChange} placeholder="Teléfono" />
        <input type="text" name="direccion" value={cliente.direccion} onChange={handleChange} placeholder="Dirección" />
        <button type="submit" style={{ background: "#282c34", color: "white", padding: "8px", border: "none", cursor: "pointer" }}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
