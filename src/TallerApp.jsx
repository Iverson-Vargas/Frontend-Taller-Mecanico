import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Login } from './pages/Login.jsx'
import { Recepcion } from './pages/Recepcion.jsx';
import { Servicios } from './pages/Servicios.jsx';
import { Inventario } from './pages/Inventario.jsx';
import { GestionEmpleados } from './pages/GestionEmpleados.jsx';
import { Facturacion } from './pages/Facturacion.jsx';
import { Egresos_Gastos } from './pages/Egresos_Gastos.jsx';
import { Reportes } from './pages/Reportes.jsx';
import { OrdenServicio } from './pages/Orden-servicio.jsx';
import { ListaClientes } from './pages/Listado-clientes.jsx';


function TallerApp() {


  return (
        <Router>
          <div className='TallerApp'>

            <div className='Menu-Lateral' >
              <h1>Prueba</h1>
                  <nav>
                    <ul>
                      <li><Link to="/Recepcion">Recepcion</Link></li>
                      <li><Link to="/Servicios">Servicios y Precios</Link></li>
                      <li><Link to="/Inventario">Inventario y Respuesto</Link></li>
                      <li><Link to="/GestionEmpleados">Gestion de Empleados </Link></li>
                      <li><Link to="/Facturacion">Facturacion</Link></li>
                      <li><Link to="/Egresos_Gastos">Egresos y Gastos</Link></li>
                      <li><Link to="/Reportes">Reportes</Link></li>
                    </ul>
                  </nav>
            </div>
  
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Recepcion" element={<Recepcion />} />
              <Route path="/Servicios" element={<Servicios />} />
              <Route path="/Inventario" element={<Inventario />} />
              <Route path="/GestionEmpleados" element={<GestionEmpleados />} />
              <Route path="/Facturacion" element={<Facturacion />} />
              <Route path="/Egresos_Gastos" element={<Egresos_Gastos />} />
              <Route path="/Reportes" element={<Reportes />} />
              <Route path="/Orden-servicio" element={<OrdenServicio />} />
              <Route path="/Listado-clientes" element={<ListaClientes />} />

            </Routes>
          </div>
        </Router>
  )
}

export default TallerApp
