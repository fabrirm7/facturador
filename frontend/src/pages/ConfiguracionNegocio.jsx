// src/pages/ConfiguracionNegocio.jsx
import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

export default function ConfiguracionNegocio() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [nombreNegocio, setNombreNegocio] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cuit, setCuit] = useState("");
  const [imprimirAutomatico, setImprimirAutomatico] = useState(false);
  const [numeracionFactura, setNumeracionFactura] = useState(1);
  const [logoUrl, setLogoUrl] = useState("");

  const cargarConfiguracion = async () => {
    try {
      const res = await api.get("/configuracion");
      const cfg = res.data || {};

      setNombreNegocio(cfg.nombreNegocio || "");
      setDireccion(cfg.direccion || "");
      setTelefono(cfg.telefono || "");
      setCuit(cfg.cuit || "");
      setImprimirAutomatico(!!cfg.imprimirAutomatico);
      setNumeracionFactura(cfg.numeracionFactura || 1);
      setLogoUrl(cfg.logoUrl || "");
    } catch (err) {
      console.error("Error al cargar configuración:", err);

      // Si el backend devuelve 404 (no hay config creada todavía),
      // dejamos los valores por defecto y NO mostramos error fuerte.
      if (err.response?.status === 404) {
        console.log("No hay configuración guardada aún, se usarán valores por defecto.");
      } else {
        toast.error("❌ Error al cargar la configuración del negocio");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await api.put("/configuracion", {
        nombreNegocio,
        direccion,
        telefono,
        cuit,
        imprimirAutomatico,
        numeracionFactura: Number(numeracionFactura) || 1,
        logoUrl,
      });

      toast.success("✅ Configuración guardada correctamente");
    } catch (err) {
      console.error("Error al guardar configuración:", err);
      if (err.response?.data?.message) {
        toast.error(`❌ ${err.response.data.message}`);
      } else {
        toast.error("❌ Error al guardar la configuración");
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Configuración del negocio</h2>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h2>Configuración del negocio</h2>
      <p style={{ color: "#555", fontSize: 14 }}>
        Estos datos se usarán en el ticket y en los informes (nombre del comercio, CUIT, etc.).
      </p>

      <form
        onSubmit={guardar}
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 0 6px rgba(0,0,0,0.1)",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Nombre del negocio:</span>
          <input
            type="text"
            value={nombreNegocio}
            onChange={(e) => setNombreNegocio(e.target.value)}
            placeholder="Ej: Kiosco Las Margaritas"
            style={{ padding: "6px 8px" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Dirección:</span>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ej: Av. Siempre Viva 742"
            style={{ padding: "6px 8px" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Teléfono / WhatsApp:</span>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 11-1234-5678"
            style={{ padding: "6px 8px" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>CUIT:</span>
          <input
            type="text"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            placeholder="Ej: 20-12345678-3"
            style={{ padding: "6px 8px" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Numeración de factura / ticket (siguiente número):</span>
          <input
            type="number"
            min="1"
            value={numeracionFactura}
            onChange={(e) => setNumeracionFactura(e.target.value)}
            style={{ padding: "6px 8px" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>URL del logo (opcional):</span>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
            style={{ padding: "6px 8px" }}
          />
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <input
            type="checkbox"
            checked={imprimirAutomatico}
            onChange={(e) => setImprimirAutomatico(e.target.checked)}
          />
          <span>Imprimir ticket automáticamente al registrar una venta</span>
        </label>

        <button
          type="submit"
          disabled={guardando}
          style={{
            marginTop: 12,
            padding: "8px 10px",
            background: guardando ? "#777" : "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: guardando ? "default" : "pointer",
          }}
        >
          {guardando ? "Guardando..." : "💾 Guardar configuración"}
        </button>
      </form>

      {/* Vista previa mínima de cómo se vería en el ticket */}
      <div
        style={{
          marginTop: 20,
          padding: 12,
          borderRadius: 6,
          background: "#f3f3f3",
          fontSize: 13,
        }}
      >
        <div style={{ marginBottom: 4, fontWeight: "bold" }}>
          Vista previa (cabecera de ticket):
        </div>
        <div>{nombreNegocio || "NOMBRE DEL NEGOCIO"}</div>
        <div>{direccion || "Dirección del comercio"}</div>
        <div>{cuit ? `CUIT: ${cuit}` : "CUIT: -"}</div>
        <div>{telefono ? `Tel: ${telefono}` : "Tel: -"}</div>
      </div>
    </div>
  );
}
