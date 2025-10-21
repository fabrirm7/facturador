import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";


export default function EditarFactura() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [factura, setFactura] = useState({
    cliente: "",
    productos: [],
  });
  const [total, setTotal] = useState(0);

  // 🧠 Calcular total localmente
  const calcularTotal = (listaProductos) => {
    let totalTemp = 0;
    for (const item of listaProductos) {
      const info = productos.find((p) => p._id === item.producto);
      if (info) totalTemp += info.precio * item.cantidad;
    }
    setTotal(totalTemp);
  };

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

        const productosFactura = resFactura.data.productos.map((p) => ({
          producto: p.producto._id,
          cantidad: p.cantidad,
        }));

        setFactura({
          cliente: resFactura.data.cliente?._id || "",
          productos: productosFactura,
        });

        calcularTotal(productosFactura);
      } catch (err) {
        console.error("Error al obtener datos:", err);
        alert("No se pudo cargar la factura.");
      }
    };
    cargar();
  }, [id]);

  const handleCliente = (e) => {
    setFactura({ ...factura, cliente: e.target.value });
  };

  const handleCantidad = (idx, val) => {
    const nuevos = [...factura.productos];
    nuevos[idx].cantidad = Number(val) || 1;
    setFactura({ ...factura, productos: nuevos });
    calcularTotal(nuevos);
  };

  const eliminarProducto = (idx) => {
    const nuevos = factura.productos.filter((_, i) => i !== idx);
    setFactura({ ...factura, productos: nuevos });
    calcularTotal(nuevos);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/facturas/${id}`, factura);
      toast.success("Factura actualizada correctamente");
      navigate("/facturas");
    } catch (err) {
      console.error("Error al actualizar:", err);
      if (err.response?.data?.message){
        toast.error(` ${err.response.data.message}`);
      } else {
        toast.error("Error al actualizar la factura");
      }
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
                <span>${info ? info.precio * item.cantidad : 0}</span>
                <button
                  type="button"
                  onClick={() => eliminarProducto(i)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 4,
                    padding: "4px 8px",
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            );
          })
        )}

        <h3 style={{ marginTop: 16 }}>Total: ${total.toLocaleString()}</h3>

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

