import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#282c34", padding: "10px" }}>
      <Link to="/clientes" style={{ color: "white", marginRight: "20px" }}>Clientes</Link>
      <Link to="/productos" style={{ color: "white", marginRight: "20px" }}>Productos</Link>
      <Link to="/facturas" style={{ color: "white" }}>Facturas</Link>
    </nav>
  );
}