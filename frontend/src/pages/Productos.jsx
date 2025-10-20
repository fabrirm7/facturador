import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        alert("Producto eliminado correctamente ✅");
        obtenerProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Productos</h2>
      <Link to="/productos/nuevo" style={{ color: "white", background: "#282c34", padding: "6px 10px", textDecoration: "none" }}>
        ➕ Agregar Producto
      </Link>

      {productos.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>{p.categoria}</td>
                <td>
                  <Link to={`/productos/editar/${p._id}`} style={{ marginRight: "10px" }}>
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => eliminarProducto(p._id)}
                    style={{ background: "red", color: "white", border: "none", cursor: "pointer" }}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}