import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

export const Menu = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const itemRefs = useRef({});

    const toggleMenu = (menuName) => {
        const isOpening = openMenu !== menuName;
        setOpenMenu(isOpening ? menuName : null);

        if (isOpening) {
            setTimeout(() => {
                const element = itemRefs.current[menuName];
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 350);
        } else {
            // Si cerramos el menú y no queda ninguno abierto, volvemos arriba para una vista limpia
            setTimeout(() => {
                const nav = document.querySelector('.no-scrollbar');
                if (nav) {
                    nav.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 300);
        }
    };

    const estilosDelEnlace = ({ isActive }) => {
        const clasesBase = "flex items-center pl-12 pr-4 py-2 text-[12.5px] transition-all duration-300 ease-in-out rounded-xl relative group my-0.5 mx-2";
        if (isActive) {
            return `${clasesBase} bg-rose-500/10 text-rose-400 font-bold shadow-[inset_3px_0_0_0_#f43f5e]`;
        } else {
            return `${clasesBase} text-slate-400 hover:bg-white/5 hover:text-slate-100`;
        }
    };

    const menuItems = [
        {
            name: 'Recepción y Diagnóstico',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
            subMenus: [
                { label: 'Registro de Cliente', path: '/panel/RegistroCliente' },
                { label: 'Registro de Vehículo', path: '/panel/RegistroVehiculo' },
                { label: 'Lista de Clientes', path: '/panel/Listado-Clientes' },
                { label: 'Nueva Orden de Servicio', path: '/panel/Orden-Servicio' }
            ]
        },
        {
            name: 'Servicios y Precios',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
            subMenus: [
                { label: 'Historial de Servicios', path: '/panel/Lista-Servicio' }
            ]
        },
        {
            name: 'Inventario y Repuestos',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>,
            subMenus: [
                { label: 'Existencias General', path: '/panel/Inventario' },
                { label: 'Control de Proveedores', path: '#' }
            ]
        },
        {
            name: 'Recursos Humanos',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
            subMenus: [
                { label: 'Gestión de Personal', path: '/panel/GestionEmpleados' },
                { label: 'Registro de Empleado', path: '/panel/RegistroEmpleado' }
            ]
        },
        {
            name: 'Facturación y Caja',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
            subMenus: [
                { label: 'Generar Recibo', path: '/panel/Facturacion' }
            ]
        },
        {
            name: 'Finanzas y Gastos',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
            subMenus: [
                { label: 'Libro Contable', path: '/panel/Contabilidad' },
                { label: 'Balance General', path: '/panel/Resumen-Financiero' }
            ]
        },
        {
            name: 'Reportes Estratégicos',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
            subMenus: [
                { label: 'Estado de Resultados', path: '/panel/ReporteGanancia' },
                { label: 'Servicios Rentables', path: '/panel/servicios-rentables' },
                { label: 'Nóminas y Comisiones', path: '/panel/ReporteNominas' },
                { label: 'Productividad Personal', path: '/panel/ControlProductividad' },
                { label: 'Valoración de Inventario', path: '/panel/MovimientoInventario' }
            ]
        }
    ];

    return (
        <aside className="fixed top-0 left-0 w-72 h-screen bg-[#0f172a] text-slate-50 shadow-2xl flex flex-col z-50 overflow-hidden font-sans border-r border-slate-800/40">

            <div className="p-8 flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase">
                    Taller<span className="text-rose-500">App</span>
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto no-scrollbar px-3">
                <ul className="flex flex-col gap-1.5 w-full pb-8">
                    {menuItems.map((item, index) => (
                        <li key={index} className="w-full">
                            {item.subMenus ? (
                                <div className="mb-1">
                                    <button
                                        ref={el => itemRefs.current[item.name] = el}
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full text-left px-4 py-3 text-[13px] font-bold transition-all duration-300 flex justify-between items-center rounded-xl group ${openMenu === item.name 
                                            ? 'bg-slate-800 text-white shadow-sm' 
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`transition-colors duration-300 ${openMenu === item.name ? 'text-rose-500' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                                {item.icon}
                                            </span>
                                            <span>{item.name}</span>
                                        </div>
                                        <svg className={`w-4 h-4 transform transition-transform duration-300 opacity-60 ${openMenu === item.name ? 'rotate-180 text-rose-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openMenu === item.name ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                        <ul className="flex flex-col space-y-0.5 border-l border-slate-800 ml-6 py-1">
                                            {item.subMenus.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <NavLink to={subItem.path} className={estilosDelEnlace}>
                                                        {subItem.label}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    onClick={() => setOpenMenu(null)}
                                    className={({ isActive }) => `flex items-center gap-3 w-full text-left px-4 py-3 text-[13px] font-bold transition-all duration-300 rounded-xl mb-1 ${isActive 
                                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                                >
                                    <span className={({ isActive }) => isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                                    <span>{item.name}</span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 mt-auto border-t border-slate-800/40 bg-slate-900/50 flex flex-col gap-2">
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-rose-500/10 text-rose-500 py-2.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest border border-rose-500/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};