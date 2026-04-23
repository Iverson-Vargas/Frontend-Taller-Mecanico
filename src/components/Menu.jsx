import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Menu = () => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    const estilosDelEnlace = ({ isActive }) => {
        const clasesBase = "block px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out border-l-4";
        if (isActive) {
            return `${clasesBase} bg-slate-900 border-sky-400 text-sky-400 font-semibold`;
        } else {
            return `${clasesBase} border-transparent text-slate-400 hover:bg-slate-700 hover:text-white`;
        }
    };

    const menuItems = [
        {
            name: 'Atención y Recepción',
            subMenus: [
                { label: 'Registrar Nuevo Ingreso', path: '/panel/Recepcion' }
            ]
        },
        {
            name: 'Directorio de Clientes',
            subMenus: [
                { label: 'Registro de Cliente', path: '/panel/RegistroCliente' },
                { label: 'Lista de Clientes', path: '/panel/Listado-Clientes' }
            ]
        },
        {
            name: 'Operaciones de Taller',
            subMenus: [
                { label: 'Registro de Nueva Orden', path: '/panel/Orden-Servicio' },
                { label: 'Historial de Atenciones', path: '/panel/Lista-Servicio' }
            ]
        },
        {
            name: 'Control de Repuestos',
            subMenus: [
                { label: 'Inventario General', path: '/panel/Inventario' }
            ]
        },
        {
            name: 'Red de Proveedores',
            subMenus: [
                { label: 'Listado de Proveedores', path: '#' }
            ]
        },
        {
            name: 'Gestión de Personal',
            subMenus: [
                { label: 'Directorio de Empleados', path: '/panel/GestionEmpleados' },
                { label: 'Registro de Empleado', path: '/panel/RegistroEmpleado' }
            ]
        },
        {
            name: 'Cobranza y Pagos',
            subMenus: [
                { label: 'Emisión de Recibos', path: '/panel/Facturacion' }
            ]
        },
        {
            name: 'Administración Financiera',
            subMenus: [
                { label: 'Libro de Cuentas', path: '/panel/Contabilidad' },
                { label: 'Balance General', path: '/panel/Resumen-Financiero' }
            ]
        },
        {
            name: 'Análisis de Resultados',
            subMenus: [
                { label: 'Panel de Estadísticas', path: '/panel/Reportes' },
                { label: 'Estado de Ganancias', path: '/panel/ReporteGanancia' },
                { label: 'Registro de Nóminas', path: '/panel/ReporteNominas' }
            ]
        }
    ];

    return (
        <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-800 text-slate-50 shadow-lg flex flex-col pt-8 z-50 overflow-hidden">
            <h1 className="text-center text-2xl font-bold mb-6 text-sky-400 tracking-wide flex-shrink-0">
                Taller App
            </h1>

            <nav className="flex-1 overflow-y-auto no-scrollbar custom-scrollbar">
                <ul className="flex flex-col gap-1 w-full pb-4">
                    {menuItems.map((item, index) => (
                        <li key={index} className="w-full">
                            <button
                                onClick={() => toggleMenu(item.name)}
                                className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors duration-300 flex justify-between items-center ${
                                    openMenu === item.name ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                <span>{item.name}</span>
                                <span className={`transform transition-transform duration-300 ${openMenu === item.name ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-800/50 ${openMenu === item.name ? 'max-h-60' : 'max-h-0'}`}>
                                <ul className="flex flex-col py-1">
                                    {item.subMenus.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <NavLink to={subItem.path} className={estilosDelEnlace}>
                                                {subItem.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto px-6 py-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
                <button
                    onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        localStorage.removeItem('userRole');
                        window.location.href = '/';
                    }}
                    className="cursor-pointer w-full bg-red-600/90 text-white py-2 px-4 rounded hover:bg-red-700 transition-all duration-300 font-medium"
                >
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};
