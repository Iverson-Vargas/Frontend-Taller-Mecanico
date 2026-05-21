import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
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
import { OrdenServicio } from './pages/Orden-servicio.jsx';
import { ListaServicio } from './pages/Listado-servicio.jsx';
import { ListaClientes } from './pages/Listado-clientes.jsx';
import { ReporteGanancia } from './pages/Reporte_ganancia.jsx';
import { ReporteNominas } from './pages/Reporte_nominas.jsx';
import { EstadoCliente } from './pages/EstadoCliente.jsx';
import { RegistroCliente } from './pages/RegistroCliente.jsx';
import { RegistroVehiculo } from './pages/RegistroVehiculo.jsx';
import { ServiciosRentables } from './pages/ServiciosRentables.jsx';
import { ControlProductividad } from './pages/ControlProductividad.jsx';
import { MovimientoValorInventario } from './pages/MovimientoValorInventario.jsx';
import { ResumenFinanciero } from './pages/ResumenFinanciero.jsx';
import { Configuracion } from './pages/Configuracion.jsx';



const PlantillaPrueba = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-50 flex items-center justify-between px-4 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-black text-sm">
                        TM
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-widest">TALLER</span>
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
                </button>
            </div>
            
            {/* Overlay for mobile */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
            )}

            <Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            <main className="md:ml-72 mt-16 md:mt-0 p-4 sm:p-6 md:p-8 w-full transition-all duration-300">
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
                <Route path='Orden-Servicio' element={<OrdenServicio />} />
                <Route path='Orden-Servicio/:id' element={<OrdenServicio />} />
                <Route path='Lista-Servicio' element={<ListaServicio />} />
                <Route path='Listado-Clientes' element={<ListaClientes />} />
                <Route path='RegistroCliente' element={<RegistroCliente />} />
                <Route path='RegistroVehiculo' element={<RegistroVehiculo />} />
                <Route path='servicios-rentables' element={<ServiciosRentables />} />
                <Route path='ControlProductividad' element={<ControlProductividad />} />
                <Route path='MovimientoInventario' element={<MovimientoValorInventario />} />
                <Route path='Configuracion' element={<Configuracion />} />
            </Route>
        </Routes>
    )
}