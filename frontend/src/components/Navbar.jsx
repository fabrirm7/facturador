import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#1f2937",
        padding: "15px 25px",
        display: "flex",
        gap: "30px",
        alignItems: "center",
        borderBottom: "2px solid #111827",
      }}
    >
      {[
        { to: "/clientes", label: "Clientes" },
        { to: "/productos", label: "Productos" },
        { to: "/facturas", label: "Facturas" },
        { to: "/caja", label: "Caja" },
        { to: "/caja-diaria", label: "Caja diaria" },
      ].map((item) => (
        <Link
          key={item.to}
          to={item.to}
          style={{
            color: "white",
            fontSize: "17px",
            textDecoration: "none",
            position: "relative",
            paddingBottom: "3px",
          }}
          className="nav-link"
        >
          {item.label}

          {/* Subrayado animado */}
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
    </nav>
  );
}

