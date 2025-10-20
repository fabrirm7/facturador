import { useEffect, useState } from "react";
import { api } from "../api";

export default function NuevaFactura() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [factura, setFactura] = useState({
    cliente: "",
    productos: [],
  });
  const [total, setTotal] = useState(0);

  // Obtener clientes y productos al cargar la vista
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClientes = await api.get("/clientes");
        const resProductos = await api.get("/productos");
        setClientes(resClientes.data);
        setProductos(resProductos.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  // Agregar un producto a la factura
  const agregarProducto = (idProducto) => {
    const existe = factura.productos.find((p) => p.producto === idProducto);
    if (existe) return alert("Este producto ya fue agregado");
    setFactura({
      ...factura,
      productos: [...factura.productos, { producto: idProducto, cantidad: 1 }],
    });
  };

  // Cambiar cantidad de un producto
  const cambiarCantidad = (idProducto, cantidad) => {
    const nuevos = factura.productos.map((p) =>
      p.producto === idProducto ? { ...p, cantidad: Number(cantidad) } : p
    );
    setFactura({ ...factura, productos: nuevos });
  };

  // Eliminar producto
  const eliminarProducto = (idProducto) => {
    const nuevos = factura.productos.filter((p) => p.producto !== idProducto);
    setFactura({ ...factura, productos: nuevos });
  };

  // Calcular total cada vez que cambian los productos
  useEffect(() => {
    const totalTemp = factura.productos.reduce((acc, p) => {
      const prod = productos.find((x) => x._id === p.producto);
      return acc + (prod ? prod.precio * p.cantidad : 0);
    }, 0);
    setTotal(totalTemp);
  }, [factura.productos, productos]);

  // Enviar factura
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/facturas", factura);
      alert("Factura creada correctamente ✅");
      setFactura({ cliente: "", productos: [] });
      setTotal(0);
    } catch (error) {
      console.error("Error al crear factura:", error);
      alert("Error al crear factura ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nueva Factura</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "600px" }}>
        {/* Selección de cliente */}
        <select
          value={factura.cliente}
          onChange={(e) => setFactura({ ...factura, cliente: e.target.value })}
          required
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nombre}
            </option>
          ))}
        </select>

        {/* Lista de productos */}
        <h3>Productos disponibles</h3>
        <ul>
          {productos.map((p) => (
            <li key={p._id}>
              {p.nombre} - ${p.precio} ({p.stock} disponibles)
              <button type="button" onClick={() => agregarProducto(p._id)} style={{ marginLeft: "10px" }}>
                ➕ Agregar
              </button>
            </li>
          ))}
        </ul>

        {/* Productos seleccionados */}
        <h3>Productos seleccionados</h3>
        {factura.productos.length === 0 ? (
          <p>No hay productos agregados</p>
        ) : (
          factura.productos.map((p) => {
            const prod = productos.find((x) => x._id === p.producto);
            return (
              <div key={p.producto}>
                {prod?.nombre} - ${prod?.precio}
                <input
                  type="number"
                  min="1"
                  max={prod?.stock}
                  value={p.cantidad}
                  onChange={(e) => cambiarCantidad(p.producto, e.target.value)}
                  style={{ marginLeft: "10px", width: "60px" }}
                />
                <button type="button" onClick={() => eliminarProducto(p.producto)} style={{ marginLeft: "10px" }}>
                  ❌ Quitar
                </button>
              </div>
            );
          })
        )}

        <h3>Total: ${total}</h3>

        <button type="submit" style={{ background: "#282c34", color: "white", padding: "10px", border: "none", cursor: "pointer" }}>
          Guardar Factura
        </button>
      </form>
    </div>
  );
}
