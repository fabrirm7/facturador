import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function EditarFactura() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [factura, setFactura] = useState({
    cliente: "",
    productos: [],
    total: 0,
  });

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    const cargar = async () => {
      try {
        const [resClientes, resProductos, resFactura] = await Promise.all([
          api.get("/clientes"),
          api.get("/productos"),
          api.get(`/facturas/${id}`),
        ]);

        setClientes(resClientes.data);
        setProductos(resProductos.data);

        // Calcular total inicial
        let total = 0;
        resFactura.data.productos.forEach((p) => {
          total += p.cantidad * p.producto.precio;
        });

        setFactura({
          cliente: resFactura.data.cliente?._id || "",
          productos: resFactura.data.productos.map((p) => ({
            producto: p.producto._id,
            cantidad: p.cantidad,
          })),
          total,
        });
      } catch (err) {
        console.error("Error al obtener datos:", err);
        alert("No se pudo cargar la factura.");
      }
    };
    cargar();
  }, [id]);

  // 🔹 Cambiar cliente
  const handleCliente = (e) => {
    setFactura({ ...factura, cliente: e.target.value });
  };

  // 🔹 Cambiar cantidad y recalcular total
  const handleCantidad = (idx, val) => {
    const nuevos = [...factura.productos];
    nuevos[idx].cantidad = Number(val) || 1;

    // Recalcular total
    let nuevoTotal = 0;
    nuevos.forEach((item) => {
      const info = productos.find((p) => p._id === item.producto);
      if (info) nuevoTotal += info.precio * item.cantidad;
    });

    setFactura({ ...factura, productos: nuevos, total: nuevoTotal });
  };

  // 🔹 Guardar cambios y actualizar stock en backend
  const guardar = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Actualizar la factura
      await api.put(`/facturas/${id}`, factura);

      // 2️⃣ Actualizar el stock en backend según las nuevas cantidades
      for (const item of factura.productos) {
        const producto = productos.find((p) => p._id === item.producto);
        if (producto) {
          await api.put(`/productos/${item.producto}`, {
            ...producto,
            stock: producto.stock - item.cantidad,
          });
        }
      }

      alert("Factura y stock actualizados correctamente ✅");
      navigate("/facturas");
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("No se pudo actualizar la factura ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Editar Factura</h2>

      <form onSubmit={guardar} style={{ maxWidth: 600 }}>
        <label>Cliente:</label>
        <select value={factura.cliente} onChange={handleCliente} required>
          <option value="">Seleccionar Cliente</option>
          {clientes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <h4 style={{ marginTop: 16 }}>Productos</h4>
        {factura.productos.length === 0 ? (
          <p>La factura no tiene productos.</p>
        ) : (
          factura.productos.map((item, i) => {
            const info = productos.find((p) => p._id === item.producto);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span style={{ flex: 1 }}>
                  {info ? info.nombre : "Producto eliminado"}
                </span>
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => handleCantidad(i, e.target.value)}
                  style={{ width: 80 }}
                />
              </div>
            );
          })
        )}

        {/* Mostrar total actualizado */}
        <h4 style={{ marginTop: 20 }}>
          Total: <span style={{ color: "green" }}>${factura.total.toFixed(2)}</span>
        </h4>

        <button
          type="submit"
          style={{
            marginTop: 16,
            background: "#282c34",
            color: "#fff",
            border: 0,
            padding: "8px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

