import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

export const Menu = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const itemRefs = useRef({});

    const toggleMenu = (menuName) => {
        const isOpening = openMenu !== menuName;
        setOpenMenu(isOpening ? menuName : null);

        if (isOpening) {
            // Wait for the CSS expansion animation to finish, then scroll if necessary
            setTimeout(() => {
                itemRefs.current[menuName]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);
        }
    };

    const estilosDelEnlace = ({ isActive }) => {
        const clasesBase = "flex items-center pl-10 pr-4 py-2.5 text-sm transition-all duration-300 ease-in-out rounded-lg relative group";
        if (isActive) {
            return `${clasesBase} bg-sky-500/10 text-sky-400 font-semibold shadow-[inset_2px_0_0_0_#38bdf8]`;
        } else {
            return `${clasesBase} text-slate-400 hover:bg-slate-800/60 hover:text-slate-200`;
        }
    };

    const menuItems = [
        {
            name: 'Recepción y Diagnóstico',
            subMenus: [
                { label: 'Registro de Cliente', path: '/panel/RegistroCliente' },
                { label: 'Registro de Vehículo', path: '/panel/RegistroVehiculo' },
                { label: 'Lista de Clientes', path: '/panel/Listado-Clientes' },
                { label: 'Registro de Nueva Orden', path: '/panel/Orden-Servicio' }
            ]
        },
        {
            name: 'Catálogo, Servicios y Precios',
            subMenus: [
                { label: 'Historial de Servicios', path: '/panel/Lista-Servicio' }
            ]
        },
        {
            name: 'Inventarios y Repuestos',
            subMenus: [
                { label: 'Inventario General', path: '/panel/Inventario' },
                { label: 'Listado de Proveedores', path: '#' }
            ]
        },
        {
            name: 'Gestión de Empleados y Nómina',
            subMenus: [
                { label: 'Directorio de Empleados', path: '/panel/GestionEmpleados' },
                { label: 'Registro de Empleado', path: '/panel/RegistroEmpleado' }
            ]
        },
        {
            name: 'Facturación y Caja',
            subMenus: [
                { label: 'Emisión de Recibos', path: '/panel/Facturacion' }
            ]
        },
        {
            name: 'Egresos y Gastos',
            subMenus: [
                { label: 'Libro de Cuentas', path: '/panel/Contabilidad' },
                { label: 'Balance General', path: '/panel/Resumen-Financiero' }
            ]
        },
        {
            name: 'Reportes',
            path: '/panel/Reportes'
        }
    ];

    return (
        <aside className="fixed top-0 left-0 w-72 h-screen bg-[#0f172a] text-slate-50 shadow-2xl shadow-black/50 border-r border-slate-800/60 flex flex-col z-50 overflow-hidden font-sans">

            <h1 className="text-center text-2xl font-bold mt-8 mb-6 text-sky-400 tracking-wide flex-shrink-0">
                Taller App
            </h1>

            <nav className="flex-1 overflow-y-auto no-scrollbar custom-scrollbar">
                <ul className="flex flex-col gap-1 w-full pb-4">
                    {menuItems.map((item, index) => (
                        <li key={index} className="w-full">
                            {item.subMenus ? (
                                <>
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
                                </>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    onClick={() => setOpenMenu(null)} // Close any open accordion
                                    className={({ isActive }) => `block w-full text-left px-6 py-3 text-sm font-medium transition-colors duration-300 ${
                                        isActive ? 'bg-slate-700 text-white border-l-4 border-sky-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white border-l-4 border-transparent'
                                    }`}
                                >
                                    <span>{item.name}</span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto px-6 py-4 bg-slate-800 border-t border-slate-700 flex-shrink-0 flex flex-col gap-3">
                <button
                    className="cursor-pointer w-full bg-slate-700/50 text-slate-300 py-2 px-4 rounded hover:bg-slate-600 transition-all duration-300 font-medium"
                >
                    Ajustes
                </button>
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
