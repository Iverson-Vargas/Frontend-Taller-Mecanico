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
        <aside className="fixed top-0 left-0 w-72 h-screen bg-[#0f172a] text-slate-50 shadow-2xl shadow-black/50 border-r border-slate-800/60 flex flex-col z-50 overflow-hidden font-sans">
            
            <h1 className="text-center text-2xl font-bold mt-8 mb-6 text-sky-400 tracking-wide flex-shrink-0">
                Taller App
            </h1>

            <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-2">
                <ul className="flex flex-col gap-1.5 w-full pb-6">
                    {menuItems.map((item, index) => {
                        const isOpen = openMenu === item.name;
                        
                        return (
                            <li 
                                key={index} 
                                className="w-full"
                                ref={(el) => itemRefs.current[item.name] = el}
                            >
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex justify-between items-center group relative overflow-hidden
                                        ${isOpen 
                                            ? 'bg-slate-800/80 text-white shadow-sm ring-1 ring-white/5' 
                                            : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                                        }`}
                                >
                                    {/* Subtle gradient background when active */}
                                    <div className={`absolute inset-0 bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : ''}`}></div>
                                    
                                    {/* Left active border indicator */}
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-sky-400 rounded-r-full transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 scale-y-0 group-hover:opacity-50 group-hover:scale-y-100 group-hover:bg-slate-500'}`}></div>
                                    
                                    <span className="relative z-10 font-semibold tracking-wide flex items-center gap-3">
                                        <svg className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                        </svg>
                                        {item.name}
                                    </span>
                                    
                                    <svg 
                                        className={`w-4 h-4 transform transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180 text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} 
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <ul className="flex flex-col gap-0.5 py-1 px-2 mt-1 mb-2 relative">
                                            {/* Submenu connector line */}
                                            <div className="absolute left-6 top-0 bottom-3 w-px bg-slate-800"></div>
                                            
                                            {item.subMenus.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <NavLink to={subItem.path} className={estilosDelEnlace}>
                                                        {({ isActive }) => (
                                                            <>
                                                                <span className={`absolute left-4 w-1.5 h-1.5 rounded-full transition-all duration-300 z-10 
                                                                    ${isActive ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] scale-110' : 'bg-slate-600 group-hover:bg-slate-400 group-hover:scale-125'}`}
                                                                ></span>
                                                                {/* Horizontal connector line to the dot */}
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-px bg-slate-800 -z-10"></span>
                                                                
                                                                {subItem.label}
                                                            </>
                                                        )}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="mt-auto px-6 py-4 bg-[#0f172a] border-t border-slate-800/60 flex-shrink-0">
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
