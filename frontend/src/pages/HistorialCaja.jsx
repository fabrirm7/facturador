import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

export default function HistorialCaja() {
  const [cajas, setCajas] = useState([]);

  const cargarHistorial = async () => {
    try {
      const res = await api.get("/caja/historial");
      setCajas(res.data);
    } catch (err) {
      console.error("Error al obtener historial de caja:", err);
      toast.error("❌ Error al obtener historial de caja");
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Historial de cajas</h2>

      {cajas.length === 0 ? (
        <p>No hay cajas registradas todavía.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            marginTop: 16,
          }}
        >
          <thead style={{ backgroundColor: "#282c34", color: "white" }}>
            <tr>
              <th style={{ padding: 8 }}>Fecha apertura</th>
              <th style={{ padding: 8 }}>Fecha cierre</th>
              <th style={{ padding: 8, textAlign: "right" }}>Monto inicial</th>
              <th style={{ padding: 8, textAlign: "right" }}>Total ventas</th>
              <th style={{ padding: 8, textAlign: "right" }}>Total esperado</th>
              <th style={{ padding: 8, textAlign: "right" }}>Monto cierre</th>
              <th style={{ padding: 8, textAlign: "right" }}>Diferencia</th>
              <th style={{ padding: 8, textAlign: "center" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {cajas.map((caja) => (
              <tr key={caja._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>
                  {caja.fechaApertura
                    ? new Date(caja.fechaApertura).toLocaleString()
                    : "-"}
                </td>
                <td style={{ padding: 8 }}>
                  {caja.fechaCierre
                    ? new Date(caja.fechaCierre).toLocaleString()
                    : "—"}
                </td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  ${Number(caja.montoInicial || 0).toFixed(2)}
                </td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  ${Number(caja.totalVentas || 0).toFixed(2)}
                </td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  ${Number(caja.totalEsperado || 0).toFixed(2)}
                </td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  {caja.estado === "cerrada"
                    ? `$${Number(caja.montoCierre || 0).toFixed(2)}`
                    : "—"}
                </td>
                <td
                  style={{
                    padding: 8,
                    textAlign: "right",
                    color:
                      Number(caja.diferencia || 0) === 0
                        ? "#4caf50"
                        : Number(caja.diferencia || 0) > 0
                        ? "#2196f3"
                        : "#f44336",
                  }}
                >
                  ${Number(caja.diferencia || 0).toFixed(2)}
                </td>
                <td style={{ padding: 8, textAlign: "center" }}>
                  {caja.estado === "cerrada" ? "✅ Cerrada" : "🟢 Abierta"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
