// src/pages/Reportes.jsx
import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

function formatoFechaInput(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Reportes() {
  const hoy = new Date();
  const hace7 = new Date();
  hace7.setDate(hoy.getDate() - 6);

  const [desde, setDesde] = useState(formatoFechaInput(hace7));
  const [hasta, setHasta] = useState(formatoFechaInput(hoy));
  const [cargando, setCargando] = useState(false);
  const [resumen, setResumen] = useState(null);

  const cargarResumen = async () => {
    try {
      setCargando(true);
      const params = new URLSearchParams();
      if (desde) params.append("desde", desde);
      if (hasta) params.append("hasta", hasta);

      const res = await api.get(`/reportes/resumen?${params.toString()}`);
      setResumen(res.data);
    } catch (err) {
      console.error("Error al obtener resumen:", err);
      toast.error("❌ Error al obtener los reportes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarResumen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBuscar = (e) => {
    e.preventDefault();
    cargarResumen();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Reportes de ventas</h2>
      <p style={{ color: "#555", fontSize: 14 }}>
        Consulta totales de ventas, facturas y productos en un rango de fechas.
      </p>

      {/* Filtros */}
      <form
        onSubmit={onBuscar}
        style={{
          marginTop: 12,
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", fontSize: 13 }}>
          <label>Desde:</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            style={{ padding: "4px 6px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 13 }}>
          <label>Hasta:</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            style={{ padding: "4px 6px" }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: "6px 10px",
            borderRadius: 4,
            border: "none",
            background: cargando ? "#777" : "#282c34",
            color: "white",
            cursor: cargando ? "default" : "pointer",
            fontSize: 14,
          }}
        >
          {cargando ? "Cargando..." : "🔍 Buscar"}
        </button>
      </form>

      {/* Resumen */}
      {!resumen ? (
        <p>No hay datos para mostrar.</p>
      ) : (
        <>
          {/* Tarjetas de resumen */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                flex: "1 1 180px",
                background: "#fff",
                padding: 12,
                borderRadius: 8,
                boxShadow: "0 0 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>Total facturado</div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                ${resumen.totalFacturado.toFixed(2)}
              </div>
            </div>

            <div
              style={{
                flex: "1 1 180px",
                background: "#fff",
                padding: 12,
                borderRadius: 8,
                boxShadow: "0 0 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>
                Facturas activas
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                {resumen.cantidadActivas}
              </div>
            </div>

            <div
              style={{
                flex: "1 1 180px",
                background: "#fff",
                padding: 12,
                borderRadius: 8,
                boxShadow: "0 0 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>
                Facturas anuladas
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#c62828" }}>
                {resumen.cantidadAnuladas}
              </div>
            </div>

            <div
              style={{
                flex: "1 1 180px",
                background: "#fff",
                padding: 12,
                borderRadius: 8,
                boxShadow: "0 0 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>
                Total facturas (activas + anuladas)
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                {resumen.cantidadFacturas}
              </div>
            </div>
          </div>

          {/* Ventas por día */}
          <div
            style={{
              marginBottom: 20,
              background: "#fff",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Ventas por día</h3>
            {resumen.ventasPorDia.length === 0 ? (
              <p style={{ fontSize: 13 }}>No hay ventas en este período.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "6px 4px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Fecha
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "6px 4px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.ventasPorDia.map((d) => (
                    <tr key={d.fecha}>
                      <td
                        style={{
                          padding: "4px 4px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {d.fecha}
                      </td>
                      <td
                        style={{
                          padding: "4px 4px",
                          textAlign: "right",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        ${d.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top productos */}
          <div
            style={{
              marginBottom: 20,
              background: "#fff",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Top productos vendidos</h3>
            {resumen.topProductos.length === 0 ? (
              <p style={{ fontSize: 13 }}>No hay productos vendidos en este período.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "6px 4px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Producto
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "6px 4px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Cantidad
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "6px 4px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.topProductos.map((p) => (
                    <tr key={p.nombre}>
                      <td
                        style={{
                          padding: "4px 4px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {p.nombre}
                      </td>
                      <td
                        style={{
                          padding: "4px 4px",
                          textAlign: "center",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {p.cantidad}
                      </td>
                      <td
                        style={{
                          padding: "4px 4px",
                          textAlign: "right",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        ${p.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
