import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Menu } from './components/Menu.jsx';
import { Login } from './pages/Login.jsx'
import { Recepcion } from './pages/Recepcion.jsx';
import { Servicios } from './pages/Servicios.jsx';
import { Inventario } from './pages/Inventario.jsx';
import { GestionEmpleados } from './pages/GestionEmpleados.jsx';
import { RegistroEmpleado } from './pages/RegistroEmpleado.jsx';
import { Facturacion } from './pages/Facturacion.jsx';
import { Egresos_Gastos } from './pages/Egresos_Gastos.jsx';
import { Reportes } from './pages/Reportes.jsx';
import { OrdenServicio } from './pages/Orden-servicio.jsx';
import { ListaServicio } from './pages/Listado-servicio.jsx';
import { ListaClientes } from './pages/Listado-clientes.jsx';
import { EstadoCliente } from './pages/EstadoCliente.jsx';
import { MovimientoValorInventario } from './pages/MovimientoValorInventario.jsx';

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
                <Route path='Recepcion' element={<Recepcion />} />
                <Route path='Servicios' element={<Servicios />} />
                <Route path='Inventario' element={<Inventario />} />
                <Route path='GestionEmpleados' element={<GestionEmpleados />} />
                <Route path='RegistroEmpleado' element={<RegistroEmpleado />} />
                <Route path='Facturacion' element={<Facturacion />} />
                <Route path='Egresos_Gastos' element={<Egresos_Gastos />} />
                <Route path='Reportes' element={<Reportes />} />
                <Route path='Orden-Servicio' element={<OrdenServicio />} />
                <Route path='Lista-Servicio' element={<ListaServicio />} />
                <Route path='Listado-Clientes' element={<ListaClientes />} />
                <Route path='Reporte-Inventario' element={<MovimientoValorInventario />} />
            </Route>
        </Routes>
    )
}