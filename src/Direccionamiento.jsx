import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { Menu } from './components/Menu.jsx';
import { Login } from './pages/Login.jsx'
import { Recepcion } from './pages/Recepcion.jsx';
import { Servicios } from './pages/Servicios.jsx';
import { Inventario } from './pages/Inventario.jsx';
import { GestionEmpleados } from './pages/GestionEmpleados.jsx';
import { Facturacion } from './pages/Facturacion.jsx';
import { Egresos_Gastos } from './pages/Egresos_Gastos.jsx';
import { Reportes } from './pages/Reportes.jsx';
import { OrdenServicio } from './pages/Orden-servicio.jsx';
import { ListaServicio } from './pages/Listado-servicio.jsx';
import { ListaClientes } from './pages/Listado-clientes.jsx';

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
            <Route path="/Prueba" element={<PlantillaPrueba />}>
                <Route path='Recepcion' element={<Recepcion />} />
                <Route path='Servicios' element={<Servicios />} />
                <Route path='Inventario' element={<Inventario />} />
                <Route path='GestionEmpleados' element={<GestionEmpleados />} />
                <Route path='Facturacion' element={<Facturacion />} />
                <Route path='Egresos_Gastos' element={<Egresos_Gastos />} />
                <Route path='Reportes' element={<Reportes />} />
            </Route>
        </Routes>
    )
}