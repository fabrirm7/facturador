import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function CajaDiaria() {
  const [caja, setCaja] = useState(null);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalEsperado, setTotalEsperado] = useState(0);
  const [montoInicial, setMontoInicial] = useState("");
  const [montoCierre, setMontoCierre] = useState("");

  const cargarCaja = async () => {
    try {
      const res = await api.get("/caja/actual");
      setCaja(res.data.caja);
      setTotalVentas(res.data.totalVentas);
      setTotalEsperado(res.data.totalEsperado);
    } catch (err) {
      // Si no hay caja abierta, 404 -> limpiamos estado
      if (err.response?.status === 404) {
        setCaja(null);
        setTotalVentas(0);
        setTotalEsperado(0);
      } else {
        console.error("Error al obtener caja:", err);
        toast.error("❌ Error al obtener estado de caja");
      }
    }
  };

  useEffect(() => {
    cargarCaja();
  }, []);

  const abrirCaja = async (e) => {
    e.preventDefault();
    try {
      await api.post("/caja/abrir", { montoInicial: Number(montoInicial) });
      toast.success("✅ Caja abierta correctamente");
      setMontoInicial("");
      cargarCaja();
    } catch (err) {
      console.error("Error al abrir caja:", err);
      if (err.response?.data?.message) {
        toast.error(`❌ ${err.response.data.message}`);
      } else {
        toast.error("Error al abrir caja");
      }
    }
  };

  const cerrarCaja = async (e) => {
    e.preventDefault();
    if (!caja) return;
    try {
      await api.post(`/caja/cerrar/${caja._id}`, {
        montoCierre: Number(montoCierre),
      });
      toast.success("✅ Caja cerrada correctamente");
      setMontoCierre("");
      cargarCaja();
    } catch (err) {
      console.error("Error al cerrar caja:", err);
      if (err.response?.data?.message) {
        toast.error(`❌ ${err.response.data.message}`);
      } else {
        toast.error("Error al cerrar caja");
      }
    }
  };

  const diferencia =
    montoCierre && !isNaN(Number(montoCierre))
      ? Number(montoCierre) - totalEsperado
      : 0;

  return (
    <div style={{ padding: 20 }}>
      {/* Título + botón historial */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Caja diaria</h2>
        <Link
          to="/caja-diaria/historial"
          style={{
            padding: "6px 10px",
            background: "#1976d2",
            color: "white",
            borderRadius: 4,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          📜 Ver historial
        </Link>
      </div>

      {/* Si NO hay caja abierta -> mostrar formulario de apertura */}
      {!caja && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            maxWidth: 400,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Abrir caja</h3>
          <form
            onSubmit={abrirCaja}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <input
              type="number"
              min="0"
              placeholder="Monto inicial en caja"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              style={{ padding: "6px 8px" }}
              required
            />
            <button
              type="submit"
              style={{
                padding: "8px 10px",
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              ✅ Abrir caja
            </button>
          </form>
        </div>
      )}

      {/* Si hay caja abierta -> mostrar estado y cierre */}
      {caja && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            maxWidth: 500,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Caja abierta</h3>
          <p>
            <strong>Fecha apertura:</strong>{" "}
            {new Date(caja.fechaApertura).toLocaleString()}
          </p>
          <p>
            <strong>Monto inicial:</strong> ${caja.montoInicial.toFixed(2)}
          </p>
          <p>
            <strong>Total ventas (facturas activas):</strong> $
            {totalVentas.toFixed(2)}
          </p>
          <p>
            <strong>Total esperado en caja:</strong> ${totalEsperado.toFixed(2)}
          </p>

          <hr />

          <h4>Cerrar caja</h4>
          <form
            onSubmit={cerrarCaja}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <label>
              Monto contado en caja (dinero real):
              <input
                type="number"
                min="0"
                value={montoCierre}
                onChange={(e) => setMontoCierre(e.target.value)}
                style={{ padding: "6px 8px", width: "100%", marginTop: 4 }}
                required
              />
            </label>

            <div>
              <strong>Diferencia:</strong>{" "}
              <span
                style={{
                  color:
                    diferencia === 0
                      ? "#4caf50"
                      : diferencia > 0
                      ? "#2196f3"
                      : "#f44336",
                }}
              >
                ${diferencia.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              style={{
                padding: "8px 10px",
                background: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              🚫 Cerrar caja
            </button>
          </form>
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
