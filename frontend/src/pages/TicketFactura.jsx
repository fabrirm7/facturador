// src/pages/TicketFactura.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function TicketFactura() {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const res = await api.get(`/facturas/${id}`);
      setFactura(res.data);

      // imprimir automáticamente
      setTimeout(() => {
        window.print();
      }, 500);
    };

    cargar();
  }, [id]);

  if (!factura) return <p>Cargando ticket...</p>;

  const fecha = new Date(factura.fecha).toLocaleString();

  return (
    <div
      style={{
        width: "250px",        // ancho típico de ticket térmico
        fontFamily: "monospace",
        padding: "10px",
      }}
    >
      {/* Encabezado */}
      <h3 style={{ textAlign: "center", margin: 0 }}>KIOSCO / MINIMERCADO</h3>
      {factura.cliente && (
        <p style={{ textAlign: "center", margin: 0 }}>
          Cliente: {factura.cliente.nombre}
        </p>
      )}
      <p style={{ textAlign: "center", margin: 0 }}>Ticket N° {factura._id}</p>
      <p style={{ textAlign: "center", marginBottom: 10 }}>{fecha}</p>

      <hr />

      {/* Detalle de productos (catálogo + manuales) */}
      {factura.productos.map((p, i) => {
        // Si es manual, usamos descripcion y precioUnitario
        const esManual = !!p.esManual || !p.producto;
        const nombre = esManual
          ? p.descripcion
          : p.producto?.nombre || p.descripcion || "Producto";

        const precioUnit =
          esManual
            ? p.precioUnitario
            : p.producto?.precio ?? p.precioUnitario ?? 0;

        const subtotal = (precioUnit || 0) * p.cantidad;

        return (
          <div key={i} style={{ marginBottom: 4 }}>
            <div style={{ fontWeight: "bold" }}>{nombre}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {p.cantidad} x ${Number(precioUnit || 0).toFixed(2)}
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        );
      })}

      <hr />

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          marginTop: 4,
        }}
      >
        <b>Total</b>
        <b>${Number(factura.total || 0).toFixed(2)}</b>
      </div>

      <hr />
      <p style={{ textAlign: "center" }}>¡Gracias por su compra!</p>
    </div>
  );
}
