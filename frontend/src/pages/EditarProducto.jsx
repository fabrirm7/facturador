import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await api.get(`/productos/${id}`);
        setProducto(res.data);
      } catch (error) {
        console.error("Error al obtener producto:", error);
        toast.error("❌ Error al cargar el producto");
      }
    };
    obtenerProducto();
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/productos/${id}`, producto);
      toast.success("✅ Producto actualizado correctamente");
      navigate("/productos");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error("Error al actualizar el producto ❌");
      }
      
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input type="text" name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input type="text" name="descripcion" value={producto.descripcion} onChange={handleChange} placeholder="Descripción" />
        <input type="number" name="precio" value={producto.precio} onChange={handleChange} placeholder="Precio" required />
        <input type="number" name="stock" value={producto.stock} onChange={handleChange} placeholder="Stock" required />
        <input type="text" name="categoria" value={producto.categoria} onChange={handleChange} placeholder="Categoría" />
        <button type="submit" style={{ background: "#282c34", color: "white", padding: "8px", border: "none", cursor: "pointer" }}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}