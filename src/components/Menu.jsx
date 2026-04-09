import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Esta función decide qué clases de Tailwind aplicar
    // Dependiendo de si 'isActive' es verdadero o falso
    const estilosDelEnlace = ({ isActive }) => {
    // Estas clases siempre se aplican
        const clasesBase = "block px-6 py-3 text-sm font-medium border-l-4 transition-all duration-300 ease-in-out";

        if (isActive) {
        // Clases cuando el usuario está en esa página (Fondo más oscuro, texto/borde azul)
        return `${clasesBase} bg-slate-900 text-sky-400 border-sky-400 font-semibold`;
        } else {
        // Clases normales con efecto hover (Texto gris, borde invisible hasta que pasas el ratón)
        return `${clasesBase} text-slate-300 border-transparent hover:bg-slate-700 hover:text-white hover:border-sky-400`;
        }
    };

    return (
        <>
            {/* Menú Superior solo para Móviles */}
            <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-slate-800 text-sky-400 flex items-center justify-between px-4 z-40 shadow-md">
                <h1 className="text-xl font-bold tracking-wide">Taller App</h1>
                <button 
                    onClick={toggleMenu} 
                    className="text-sky-400 focus:outline-none p-2 rounded-md hover:bg-slate-700 transition"
                    aria-label="Abrir menú"
                >
                    {isOpen ? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Fondo oscuro cuando el menú está abierto en móvil */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity" 
                    onClick={closeMenu}
                ></div>
            )}

            {/* Contenedor principal del Menú Lateral */}
            <aside className={`fixed top-0 left-0 w-64 h-full bg-slate-800 text-slate-50 shadow-2xl flex flex-col pt-6 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

                {/* Título del sistema - Oculto en móviles porque ya está en el navbar superior */}
                <h1 className="hidden md:block text-center text-2xl font-bold mb-6 text-sky-400 tracking-wide">
                    Taller App
                </h1>

                {/* Área con scroll por si hay muchas opciones */}
                <nav className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    <ul className="flex flex-col gap-1 w-full pb-4">
                        <li><NavLink to="/panel/Recepcion" onClick={closeMenu} className={estilosDelEnlace}>Recepción</NavLink></li>
                        <li><NavLink to="/panel/Orden-Servicio" onClick={closeMenu} className={estilosDelEnlace}>Orden de Servicio</NavLink></li>          
                        <li><NavLink to="/panel/Inventario" onClick={closeMenu} className={estilosDelEnlace}>Inventario y Repuestos</NavLink></li>
                        <li><NavLink to="/panel/GestionEmpleados" onClick={closeMenu} className={estilosDelEnlace}>Gestión de Empleados</NavLink></li>
                        <li><NavLink to="/panel/Facturacion" onClick={closeMenu} className={estilosDelEnlace}>Facturación</NavLink></li>
                        <li><NavLink to="/panel/Egresos_Gastos" onClick={closeMenu} className={estilosDelEnlace}>Egresos y Gastos</NavLink></li>
                        <li><NavLink to="/panel/Reportes" onClick={closeMenu} className={estilosDelEnlace}>Reportes</NavLink></li>
                    </ul>
                </nav>

                {/* Botón de cerrar sesión */}
                <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                    <button
                        onClick={() => {
                            localStorage.removeItem('isAuthenticated');
                            localStorage.removeItem('userRole');
                            window.location.href = '/';
                        }}
                        className="cursor-pointer flex items-center justify-center gap-2 w-full bg-red-600/90 text-white py-2.5 px-4 rounded-lg hover:bg-red-500 transition-all duration-300 font-medium shadow-md hover:shadow-red-500/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
};
