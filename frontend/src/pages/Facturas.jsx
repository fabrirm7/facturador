// src/pages/Facturas.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerFacturas = async () => {
    try {
      setCargando(true);
      const res = await api.get("/facturas");
      setFacturas(res.data || []);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      toast.error("❌ Error al obtener facturas");
    } finally {
      setCargando(false);
    }
  };

  const anularFactura = async (id) => {
    if (!confirm("¿Seguro que deseas anular esta factura?")) return;

    try {
      const res = await api.put(`/facturas/${id}/anular`);

      toast.info(res.data?.message || "Factura anulada correctamente ✅");
      obtenerFacturas();
    } catch (err) {
      const msg =
        err.response?.data?.message || "❌ Error al anular la factura";
      toast.error(msg);
    }
  };

  useEffect(() => {
    obtenerFacturas();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Facturas</h2>

      <Link
        to="/facturas/nueva"
        style={{
          color: "white",
          background: "#282c34",
          padding: "6px 10px",
          textDecoration: "none",
          borderRadius: "4px",
          display: "inline-block",
          marginBottom: "15px",
        }}
      >
        ➕ Nueva Factura
      </Link>

      {cargando ? (
        <p>Cargando facturas...</p>
      ) : facturas.length === 0 ? (
        <p>No hay facturas registradas.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#282c34", color: "white" }}>
            <tr>
              <th style={{ padding: "10px", textAlign: "left" }}>Cliente</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Fecha</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Estado</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((f) => (
              <tr key={f._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>
                  {f.cliente?.nombre || "Sin nombre"}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {f.fecha ? new Date(f.fecha).toLocaleDateString() : "-"}
                </td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  ${f.total?.toLocaleString() || "0"}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {f.estado === "anulada" ? "🚫 Anulada" : "✅ Activa"}
                </td>

                <td style={{ textAlign: "center" }}>
                  {/* Botón EDITAR */}
                  <Link
                    to={`/facturas/editar/${f._id}`}
                    style={{
                      background: "#282c34",
                      color: "white",
                      padding: "5px 8px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      marginRight: "5px",
                    }}
                  >
                    ✏️ Editar
                  </Link>

                  {/* Botón TICKET */}
                  <Link
                    to={`/facturas/ticket/${f._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#007bff",
                      color: "white",
                      padding: "5px 8px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      marginRight: "5px",
                    }}
                  >
                    🧾 Ticket
                  </Link>

                  {/* Botón ANULAR */}
                  <button
                    onClick={() => anularFactura(f._id)}
                    style={{
                      background: "#ff9800",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    🚫 Anular
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

