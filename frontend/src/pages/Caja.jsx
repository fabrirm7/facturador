// src/pages/Caja.jsx
import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

export default function Caja() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [carrito, setCarrito] = useState([]); // {producto, nombre, precio, cantidad}
  const [pagaCon, setPagaCon] = useState("");
  const [total, setTotal] = useState(0);
  const [busqueda, setBusqueda] = useState(""); // 🔍 búsqueda por nombre
  const [codigoInput, setCodigoInput] = useState(""); // 🧾 código / código de barras

  // Cargar clientes y productos
  useEffect(() => {
    const cargar = async () => {
      try {
        const [resClientes, resProductos] = await Promise.all([
          api.get("/clientes"),
          api.get("/productos"),
        ]);
        setClientes(resClientes.data);
        setProductos(resProductos.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("❌ Error al cargar clientes o productos");
      }
    };
    cargar();
  }, []);

  // Recalcular total cuando cambia el carrito
  useEffect(() => {
    const t = carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(t);
  }, [carrito]);

  const agregarAlCarrito = (prod) => {
    const existe = carrito.find((i) => i.producto === prod._id);
    if (existe) {
      setCarrito(
        carrito.map((i) =>
          i.producto === prod._id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          producto: prod._id,
          nombre: prod.nombre,
          precio: prod.precio,
          cantidad: 1,
        },
      ]);
    }
  };

  const cambiarCantidad = (id, cant) => {
    const n = Math.max(1, Number(cant) || 1);
    setCarrito(
      carrito.map((i) =>
        i.producto === id ? { ...i, cantidad: n } : i
      )
    );
  };

  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter((i) => i.producto !== id));
  };

  const limpiarTodo = () => {
    setCarrito([]);
    setPagaCon("");
    setTotal(0);
  };

  const confirmarVenta = async () => {
    if (!clienteSeleccionado) {
      toast.warning("⚠️ Selecciona un cliente");
      return;
    }
    if (carrito.length === 0) {
      toast.warning("⚠️ No hay productos en la venta");
      return;
    }

    try {
      await api.post("/facturas", {
        cliente: clienteSeleccionado,
        productos: carrito.map((i) => ({
          producto: i.producto,
          cantidad: i.cantidad,
        })),
      });

      toast.success("✅ Venta registrada correctamente");
      limpiarTodo();
    } catch (err) {
      console.error("Error al registrar venta:", err);
      if (err.response?.data?.message) {
        toast.error(`❌ ${err.response.data.message}`);
      } else {
        toast.error("Error al registrar la factura");
      }
    }
  };

  const vuelto =
    pagaCon && !isNaN(Number(pagaCon)) ? Number(pagaCon) - total : 0;

  // 🔍 Filtrar productos por nombre según la búsqueda
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🧾 Agregar producto por código / código de barras
  const agregarPorCodigo = () => {
    const code = codigoInput.trim();
    if (!code) return;

    const prod = productos.find(
      (p) => (p.codigo || "").toString().trim() === code
    );

    if (!prod) {
      toast.error(`❌ No se encontró producto con código ${code}`);
      return;
    }

    agregarAlCarrito(prod);
    setCodigoInput("");
  };

  // ⌨ Atajo global: ESC para limpiar todo el ticket
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        limpiarTodo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        padding: 20,
        minHeight: "calc(100vh - 60px)",
        boxSizing: "border-box",
      }}
    >
      {/* Columna izquierda: productos */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 26, marginBottom: 12 }}>Productos</h2>

        {/* 🧾 Código / código de barras */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Código / código de barras"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                agregarPorCodigo();
              }
            }}
            style={{
              flex: 1,
              padding: "6px 8px",
              fontSize: 14,
              borderRadius: 4,
              border: "1px solid #bbb",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={agregarPorCodigo}
            style={{
              padding: "6px 10px",
              fontSize: 14,
              borderRadius: 4,
              border: "none",
              background: "#1976d2",
              color: "white",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ➕ Agregar
          </button>
        </div>

        {/* 🔍 Buscador por nombre */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            marginBottom: 10,
            fontSize: 14,
            borderRadius: 4,
            border: "1px solid #bbb",
            boxSizing: "border-box",
          }}
        />

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            maxHeight: 500,
            overflowY: "auto",
            margin: 0,
          }}
        >
          {productosFiltrados.map((p) => (
            <li
              key={p._id}
              style={{
                padding: "10px 12px",
                marginBottom: 6,
                background: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 4,
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                fontSize: 15,
              }}
            >
              <span>
                {p.nombre} <strong>(${p.precio})</strong>
              </span>
              <button
                onClick={() => agregarAlCarrito(p)}
                style={{
                  width: 34,
                  height: 30,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  background: "#f0f0f0",
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                +
              </button>
            </li>
          ))}
          {productosFiltrados.length === 0 && (
            <li style={{ fontSize: 14, color: "#555" }}>
              No se encontraron productos.
            </li>
          )}
        </ul>
      </div>

      {/* Columna centro: ticket */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 26, marginBottom: 12 }}>Ticket</h2>

        {/* Cliente */}
        <div style={{ marginBottom: 12, fontSize: 15 }}>
          <label style={{ marginRight: 8 }}>Cliente:</label>
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            style={{
              padding: "4px 6px",
              fontSize: 14,
              minWidth: 220,
            }}
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {carrito.length === 0 ? (
          <p style={{ fontSize: 15 }}>No hay productos agregados.</p>
        ) : (
          <table
            style={{
              width: "100%",
              background: "#ffffff",
              borderCollapse: "collapse",
              borderRadius: 6,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              fontSize: 14,
            }}
          >
            <thead
              style={{
                background: "#2f343a",
                color: "white",
              }}
            >
              <tr>
                <th style={{ padding: 8, textAlign: "left" }}>Prod</th>
                <th style={{ padding: 8 }}>Cant</th>
                <th style={{ padding: 8 }}>Subtot</th>
                <th style={{ padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.producto}>
                  <td style={{ padding: 8 }}>{item.nombre}</td>
                  <td style={{ padding: 8, textAlign: "center" }}>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(item.producto, e.target.value)
                      }
                      style={{ width: 60, fontSize: 14 }}
                    />
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </td>
                  <td style={{ padding: 8, textAlign: "center" }}>
                    <button
                      onClick={() => quitarDelCarrito(item.producto)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 4,
                        padding: "4px 8px",
                        fontSize: 13,
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Columna derecha: total, paga con, vuelto */}
      <div
        style={{
          flexBasis: 320,
          background: "#111",
          color: "white",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div>
          <div style={{ opacity: 0.7, letterSpacing: 2, fontSize: 18 }}>
            TOTAL
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: "bold",
              marginTop: 4,
            }}
          >
            ${total.toFixed(2)}
          </div>

          <div style={{ marginTop: 24 }}>
            <label style={{ fontSize: 16 }}>Paga con:</label>
            <input
              type="number"
              value={pagaCon}
              onChange={(e) => setPagaCon(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirmarVenta();
                }
              }}
              style={{
                width: "100%",
                fontSize: 24,
                marginTop: 6,
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #555",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>Su vuelto:</div>
            <div
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: vuelto >= 0 ? "#4caf50" : "#ff5252",
              }}
            >
              ${vuelto.toFixed(2)}
            </div>
          </div>
        </div>

        <button
          onClick={confirmarVenta}
          style={{
            marginTop: 26,
            padding: "12px 10px",
            fontSize: 20,
            background: "#2e7d32",
            border: "none",
            color: "white",
            cursor: "pointer",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          ✅ Confirmar venta
        </button>
      </div>
    </div>
  );
}
