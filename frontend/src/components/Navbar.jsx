import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#282c34", padding: "10px" }}>
      <Link to="/clientes" style={{ color: "white", marginRight: "20px" }}>Clientes</Link>
      <Link to="/productos" style={{ color: "white", marginRight: "20px" }}>Productos</Link>
      <Link to="/facturas" style={{ color: "white", marginRight: "20px" }}>Facturas</Link>
      <Link to="/caja" style={{ color: "white", marginRight: "20px" }}>Caja</Link>
      <Link to="/caja-diaria" style={{ color: "white", marginRight: "20px" }}>Caja diaria</Link>
      <Link to="/reportes" style={{ color: "white", marginRight: "20px" }}>Reportes</Link>
      <Link to="/configuracion" style={{ color: "white" }}>Configuración</Link>
    </nav>
  );
}
