import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Clientes from "./pages/Clientes";
import AgregarCliente from "./pages/AgregarCliente";
import EditarCliente from "./pages/EditarClientes";
import Productos from "./pages/Productos";
import EditarProducto from "./pages/EditarProducto";
import AgregarProducto from "./pages/AgregarProducto";
import NuevaFactura from "./pages/NuevaFactura";
import Facturas from "./pages/Facturas";
import EditarFactura from "./pages/EditarFactura";
import Caja from "./pages/Caja";
import TicketFactura from "./pages/TicketFactura";
import CajaDiaria from "./pages/CajaDiaria";
import HistorialCaja from "./pages/HistorialCaja";
import ConfiguracionNegocio from "./pages/ConfiguracionNegocio"; // 👈 NUEVO
import Reportes from "./pages/Reportes";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Clientes />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/nuevo" element={<AgregarCliente />} />
        <Route path="/clientes/editar/:id" element={<EditarCliente />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/nuevo" element={<AgregarProducto />} />
        <Route path="/productos/editar/:id" element={<EditarProducto />} />
        <Route path="/facturas" element={<Facturas />} />
        <Route path="/facturas/nueva" element={<NuevaFactura />} />
        <Route path="/facturas/editar/:id" element={<EditarFactura />} />

        <Route path="/caja" element={<Caja />} />
        <Route path="/facturas/ticket/:id" element={<TicketFactura />} />

        <Route path="/caja-diaria" element={<CajaDiaria />} />
        <Route path="/caja-diaria/historial" element={<HistorialCaja />} />

        {/* Configuración del negocio */}
        <Route path="/configuracion" element={<ConfiguracionNegocio />} />
        <Route path="/reportes" element={<Reportes />} />

      </Routes>
    </Router>
  );
}

export default App;
