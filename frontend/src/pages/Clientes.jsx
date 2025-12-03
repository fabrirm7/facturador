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
    } catch {
      toast.error("❌ Error al cargar los clientes");
    }
  };

  const eliminarCliente = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        toast.success("🗑️ Cliente eliminado correctamente");
        obtenerClientes();
      } catch (error) {
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
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* CABECERA */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px" }}>Listado de Clientes</h2>

        <Link
          to="/clientes/nuevo"
          style={{
            background: "#0d6efd",
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          ➕ Agregar Cliente
        </Link>
      </div>

      {/* TABLA */}
      {clientes.length === 0 ? (
        <p style={{ fontSize: "16px", opacity: 0.8 }}>
          No hay clientes cargados.
        </p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f7fa", textAlign: "left" }}>
                <th style={th}>Nombre</th>
                <th style={th}>CUIT</th>
                <th style={th}>Email</th>
                <th style={th}>Teléfono</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((c) => (
                <tr
                  key={c._id}
                  style={{
                    borderBottom: "1px solid #eee",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fbff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={td}>{c.nombre}</td>
                  <td style={td}>{c.cuit}</td>
                  <td style={td}>{c.email}</td>
                  <td style={td}>{c.telefono}</td>

                  <td style={td}>
                    <Link
                      to={`/clientes/editar/${c._id}`}
                      style={{
                        marginRight: "10px",
                        background: "#ffc107",
                        color: "black",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                    >
                      ✏️ Editar
                    </Link>

                    <button
                      onClick={() => eliminarCliente(c._id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* FOOTER */}
      <footer
        style={{
          marginTop: "80px",
          padding: "20px",
          textAlign: "center",
          color: "#888",
          fontSize: "14px",
          borderTop: "1px solid #ddd",
        }}
      >
        © Novasoft - Todos los derechos reservados 2025
      </footer>
    </div>
  );
}

// estilos de celdas
const th = { padding: "12px", fontWeight: "bold", color: "#333" };
const td = { padding: "12px", fontSize: "15px" };
