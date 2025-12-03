import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaFileInvoice,
  FaCashRegister,
  FaCalendarDay,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

export default function Navbar() {
  const navItems = [
    { to: "/clientes", label: "Clientes", icon: <FaUsers /> },
    { to: "/productos", label: "Productos", icon: <FaBoxOpen /> },
    { to: "/facturas", label: "Facturas", icon: <FaFileInvoice /> },
    { to: "/caja", label: "Caja", icon: <FaCashRegister /> },
    { to: "/caja-diaria", label: "Caja diaria", icon: <FaCalendarDay /> },
    { to: "/reportes", label: "Reportes", icon: <FaChartBar /> },
    { to: "/configuracion", label: "Configuración", icon: <FaCog /> },
  ];

  return (
    <nav
      style={{
        background: "#1f2937",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #111827",
      }}
    >
      {/* Menú de navegación */}
      <div style={{ display: "flex", gap: "30px" }}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: "white",
              fontSize: "17px",
              textDecoration: "none",
              position: "relative",
              paddingBottom: "3px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            className="nav-link"
          >
            {item.icon}
            {item.label}
            <span
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 0,
                height: "2px",
                background: "#60a5fa",
                transition: "0.3s",
              }}
              className="underline"
            ></span>
          </Link>
        ))}
      </div>

      {/* Texto alineado a la derecha */}
      <div style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
        Novasoft
      </div>
    </nav>
  );
}
