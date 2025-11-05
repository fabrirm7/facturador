import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  const obtenerClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (error) {
       toast.error("❌ Error al cargar los clientes");
    }
  };

  const eliminarCliente = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        toast.success("🗑️ Cliente eliminado correctamente");
        obtenerClientes(); // recargar lista
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        if (error.response?.data?.message) {
          toast.error(`❌ ${error.response.data.message}`);
        } else {
          toast.error("Error al eliminar el cliente ❌");
        }
      }
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Clientes</h2>
      <Link to="/clientes/nuevo" style={{ color: "white", background: "#282c34", padding: "6px 10px", textDecoration: "none" }}>
        ➕ Agregar Cliente
      </Link>

      {clientes.length === 0 ? (
        <p>No hay clientes cargados.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CUIT</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c._id}>
                <td>{c.nombre}</td>
                <td>{c.cuit}</td>
                <td>{c.email}</td>
                <td>{c.telefono}</td>
                <td>
                  <Link to={`/clientes/editar/${c._id}`} style={{ marginRight: "10px" }}>
                    ✏️ Editar
                  </Link>
                  <button onClick={() => eliminarCliente(c._id)} style={{ background: "red", color: "white", border: "none", cursor: "pointer" }}>
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
