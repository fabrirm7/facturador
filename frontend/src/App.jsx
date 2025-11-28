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


        
      </Routes>
    </Router>
  );
}

export default App;
