// src/pages/TicketFactura.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";

export default function TicketFactura() {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [config, setConfig] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // Traemos factura y configuración en paralelo
        const [resFactura, resCfg] = await Promise.all([
          api.get(`/facturas/${id}`),
          api.get("/configuracion").catch(() => ({ data: null })), // si falla, seguimos con defaults
        ]);

        setFactura(resFactura.data);
        setConfig(resCfg.data || null);
      } catch (err) {
        console.error("Error al cargar factura o configuración:", err);
        toast.error("Error al cargar la factura o configuración");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  if (cargando) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Ticket</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!factura) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Ticket</h2>
        <p>No se encontró la factura.</p>
        <Link to="/caja" style={{ color: "#6a1b9a" }}>
          ← Volver a caja
        </Link>
      </div>
    );
  }

  // ── Datos del negocio (con defaults por si falta algo) ──
  const nombreNegocio = config?.nombreNegocio || "NOMBRE DEL NEGOCIO";
  const direccion = config?.direccion || "Dirección del comercio";
  const telefono = config?.telefono || "";
  const cuit = config?.cuit || "-";

  // Nro de ticket (si no tenés campo, generamos uno cortando el _id)
  const nroTicket =
    factura.numeroTicket ||
    `TKT ${factura._id.slice(-6).toUpperCase()}`;

  const fechaStr = new Date(factura.fecha).toLocaleString();

  const nombreCliente =
    factura.cliente?.nombre || "Consumidor Final";

  // Normalizamos ítems para mostrar (manuales y de catálogo)
  const items = (factura.productos || []).map((item, idx) => {
    const esManual = item.esManual || !item.producto;
    const descripcion =
      (esManual && (item.descripcion || item.nombre)) ||
      item.producto?.nombre ||
      `Item ${idx + 1}`;

    const precioUnit =
      esManual
        ? item.precioUnitario ?? item.precio ?? 0
        : item.producto?.precio ?? 0;

    const cantidad = item.cantidad || 1;
    const importe = precioUnit * cantidad;

    return {
      id: item._id || idx,
      descripcion,
      cantidad,
      importe,
    };
  });

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="ticket-print"
        style={{
          width: 320, // ancho tipo rollo 58mm aprox
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 0 8px rgba(0,0,0,0.15)",
          padding: "16px 12px",
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          color: "#000",
        }}
      >
        {/* CABECERA */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          {config?.logoUrl && (
            <div style={{ marginBottom: 6 }}>
              <img
                src={config.logoUrl}
                alt="Logo"
                style={{ maxWidth: 60, maxHeight: 60 }}
              />
            </div>
          )}
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            {nombreNegocio}
          </div>
          <div>{direccion}</div>
          {telefono && <div>Tel: {telefono}</div>}
          <div>CUIT: {cuit}</div>
          <div style={{ marginTop: 4 }}>
            <strong>{nroTicket}</strong>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px dashed #000" }} />

        {/* INFO FACTURA */}
        <div style={{ marginBottom: 6 }}>
          <div>Fecha: {fechaStr}</div>
          <div>Cliente: {nombreCliente}</div>
        </div>

        <hr style={{ border: "none", borderTop: "1px dashed #000" }} />

        {/* DETALLE DE ITEMS */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 6,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  paddingBottom: 4,
                }}
              >
                Descripción
              </th>
              <th
                style={{
                  textAlign: "center",
                  paddingBottom: 4,
                  width: 40,
                }}
              >
                Cant
              </th>
              <th
                style={{
                  textAlign: "right",
                  paddingBottom: 4,
                  width: 70,
                }}
              >
                Importe
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td
                  style={{
                    padding: "2px 0",
                    wordBreak: "break-word",
                  }}
                >
                  {it.descripcion}
                </td>
                <td
                  style={{
                    padding: "2px 0",
                    textAlign: "center",
                  }}
                >
                  {it.cantidad}
                </td>
                <td
                  style={{
                    padding: "2px 0",
                    textAlign: "right",
                  }}
                >
                  ${it.importe.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={{ border: "none", borderTop: "1px dashed #000" }} />

        {/* TOTAL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          <span>TOTAL:</span>
          <span>${factura.total.toFixed(2)}</span>
        </div>

        {/* ESTADO */}
        {factura.estado === "anulada" && (
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontWeight: "bold",
              color: "#c62828",
            }}
          >
            *** FACTURA ANULADA ***
          </div>
        )}

        {/* MENSAJE FINAL */}
        <div
          style={{
            marginTop: 10,
            textAlign: "center",
            fontSize: 11,
          }}
        >
          ¡Gracias por su compra!
        </div>

        {/* BOTONES (NO SE IMPRIMEN) */}
        <div
          className="no-print"
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: 4,
              border: "none",
              background: "#2e7d32",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            🖨 Imprimir
          </button>
          <Link
            to="/caja"
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: 4,
              border: "none",
              background: "#555",
              color: "#fff",
              textAlign: "center",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            ← Volver a caja
          </Link>
        </div>
      </div>
    </div>
  );
}
