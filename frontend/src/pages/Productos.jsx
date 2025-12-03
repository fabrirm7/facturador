import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch {
      toast.error("❌ Error al cargar los productos");
    }
  };

  const eliminarProducto = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        toast.success("🗑️ Producto eliminado correctamente");
        obtenerProductos();
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(`❌ ${error.response.data.message}`);
        } else {
          toast.error("Error al eliminar el producto ❌");
        }
      }
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
      
      {/* CABECERA */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px" }}>Listado de Productos</h2>

        <Link
          to="/productos/nuevo"
          style={{
            background: "#0d6efd",
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
          }}
        >
          ➕ Agregar Producto
        </Link>
      </div>

      {/* TABLA */}
      {productos.length === 0 ? (
        <p style={{ fontSize: "16px", opacity: 0.8 }}>No hay productos cargados.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f7fa", textAlign: "left" }}>
                <th style={th}>Nombre</th>
                <th style={th}>Código</th>
                <th style={th}>Precio</th>
                <th style={th}>Stock</th>
                <th style={th}>Categoría</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr
                  key={p._id}
                  style={{
                    borderBottom: "1px solid #eee",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fbff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={td}>{p.nombre}</td>
                  <td style={td}>{p.codigo}</td>
                  <td style={td}>${p.precio}</td>
                  <td style={td}>{p.stock}</td>
                  <td style={td}>{p.categoria}</td>

                  <td style={td}>
                    <Link
                      to={`/productos/editar/${p._id}`}
                      style={{
                        marginRight: "10px",
                        background: "#ffc107",
                        color: "black",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "bold"
                      }}
                    >
                      ✏️ Editar
                    </Link>

                    <button
                      onClick={() => eliminarProducto(p._id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// estilos de tabla
const th = { padding: "12px", fontWeight: "bold", color: "#333" };
const td = { padding: "12px", fontSize: "15px" };

