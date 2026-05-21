import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Menu } from './components/Menu.jsx';
import { Login } from './pages/Login.jsx'
import { Servicios } from './pages/Servicios.jsx';
import { Inventario } from './pages/Inventario.jsx';
import { GestionEmpleados } from './pages/GestionEmpleados.jsx';
import { RegistroEmpleado } from './pages/RegistroEmpleado.jsx';
import { EditarEmpleado } from './pages/EditarEmpleado.jsx';
import { Facturacion } from './pages/Facturacion.jsx';
import { Contabilidad } from './pages/Contabilidad.jsx';
import { Reportes } from './pages/Reportes.jsx';
import { ResumenFinanciero } from './pages/ResumenFinanciero.jsx';
import { OrdenServicio } from './pages/Orden-servicio.jsx';
import { ListaServicio } from './pages/Listado-servicio.jsx';
import { ListaClientes } from './pages/Listado-clientes.jsx'; 
import { ReporteGanancia } from './pages/Reporte_ganancia.jsx';
import { ReporteNominas } from './pages/Reporte_nominas.jsx';
import { EstadoCliente } from './pages/EstadoCliente.jsx';
import { RegistroCliente } from './pages/RegistroCliente.jsx';
import { RegistroVehiculo } from './pages/RegistroVehiculo.jsx';
import { ServiciosRentables } from './pages/ServiciosRentables.jsx';

const PlantillaPrueba = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Menu />
            <main className="ml-72 p-8 w-full transition-all duration-300">
                <Outlet />
            </main>
        </div>
    )
}

export const Direccionamiento = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/estado-cliente' element={
                <ProtectedRoute>
                    <EstadoCliente />
                </ProtectedRoute>
            } />
            <Route path="/panel" element={
                <ProtectedRoute>
                    <PlantillaPrueba />
                </ProtectedRoute>
            }>
                <Route index element={<RegistroCliente />} />
                
                <Route path='ReporteGanancia' element={<ReporteGanancia />} />
                <Route path='ReporteNominas' element={<ReporteNominas />} />
                <Route path='Servicios' element={<Servicios />} />
                <Route path='Inventario' element={<Inventario />} />
                <Route path='GestionEmpleados' element={<GestionEmpleados />} />
                <Route path='RegistroEmpleado' element={<RegistroEmpleado />} />
                <Route path='EditarEmpleado/:id' element={<EditarEmpleado />} />
                <Route path='Facturacion' element={<Facturacion />} />
                <Route path='Contabilidad' element={<Contabilidad />} />
                <Route path='Reportes' element={<Reportes />} />
                <Route path='Resumen-Financiero' element={<ResumenFinanciero />} />
                <Route path='servicios-rentables' element={<ServiciosRentables />} />
                
                {/* RUTAS CORREGIDAS EN MINÚSCULAS */}
                <Route path='orden-servicio' element={<OrdenServicio />} />
                <Route path='Lista-Servicio' element={<ListaServicio />} />
                <Route path='Listado-Clientes' element={<ListaClientes />} />
                <Route path='RegistroCliente' element={<RegistroCliente />} />
                <Route path='RegistroVehiculo' element={<RegistroVehiculo />} />
            </Route>
        </Routes>
    )
}