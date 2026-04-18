import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Menu } from './components/Menu.jsx';
import { Login } from './pages/Login.jsx'
import { Recepcion } from './pages/Recepcion.jsx';
import { Servicios } from './pages/Servicios.jsx';
import { Inventario } from './pages/Inventario.jsx';
import { GestionEmpleados } from './pages/GestionEmpleados.jsx';
import { RegistroEmpleado } from './pages/RegistroEmpleado.jsx';
import { EditarEmpleado } from './pages/EditarEmpleado.jsx';
import { Facturacion } from './pages/Facturacion.jsx';
import { Contabilidad } from './pages/Egresos_Gastos.jsx';
import { Reportes } from './pages/Reportes.jsx';
import { ResumenFinanciero } from './pages/ResumenFinanciero.jsx';
import { OrdenServicio } from './pages/Orden-servicio.jsx';
import { ListaServicio } from './pages/Listado-servicio.jsx';
import { ListaClientes } from './pages/Listado-clientes.jsx';
import { ReporteGanancia } from './pages/Reporte_ganancia.jsx';
import { ReporteNominas } from './pages/Reporte_nominas.jsx';
import { EstadoCliente } from './pages/EstadoCliente.jsx';

export const Direccionamiento = () => {

    function PlantillaPrueba() {
        return(
            <div className="min-h-screen bg-gray-50">
                <Menu />
                <main className="ml-65 p-4">
                    <Outlet />
                </main>
            </div>
        )
    }

    return(
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
                <Route path='Recepcion' element={<Recepcion />} />
                <Route path='Servicios' element={<Servicios />} />
                <Route path='Inventario' element={<Inventario />} />
                <Route path='GestionEmpleados' element={<GestionEmpleados />} />
                <Route path='RegistroEmpleado' element={<RegistroEmpleado />} />
                <Route path='EditarEmpleado/:id' element={<EditarEmpleado />} />
                <Route path='Facturacion' element={<Facturacion />} />
                <Route path='Contabilidad' element={<Contabilidad />} />
                <Route path='Egresos_Gastos' element={<Contabilidad />} />
                <Route path='Reportes' element={<Reportes />} />
                <Route path='Resumen-Financiero' element={<ResumenFinanciero />} />
                <Route path='Orden-Servicio' element={<OrdenServicio />} />
                <Route path='Lista-Servicio' element={<ListaServicio />} />
                <Route path='Listado-Clientes' element={<ListaClientes />} />
            </Route>
        </Routes>
    )
}
