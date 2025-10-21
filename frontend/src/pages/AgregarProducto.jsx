import { useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify"; // ✅ importamos toastif
export default function AgregarProducto() {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/productos", producto);
      toast.success("Producto agregado correctamente ");
      setProducto({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "" });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error("Hubo un error al agregar el producto ❌");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input type="text" name="nombre" placeholder="Nombre" value={producto.nombre} onChange={handleChange} required />
        <input type="text" name="descripcion" placeholder="Descripción" value={producto.descripcion} onChange={handleChange} />
        <input type="number" name="precio" placeholder="Precio" value={producto.precio} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" value={producto.stock} onChange={handleChange} required />
        <input type="text" name="categoria" placeholder="Categoría" value={producto.categoria} onChange={handleChange} />
        <button type="submit" style={{ background: "#282c34", color: "white", padding: "8px", border: "none", cursor: "pointer" }}>
          Guardar Producto
        </button>
      </form>
    </div>
  );
}