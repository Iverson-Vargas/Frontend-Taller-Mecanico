import { NavLink } from 'react-router-dom';

export const Menu = () => {
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
    // Contenedor principal: Fijo a la izquierda, fondo oscuro (slate-800), ocupa toda la altura
        <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-800 text-slate-50 shadow-lg flex flex-col pt-8 z-50">

        {/* Título del sistema */}

        <h1 className="text-center text-2xl font-bold mb-8 text-sky-400 tracking-wide">
            Taller App
        </h1>

            <nav>
            {/* Lista con un pequeño gap entre botones */}
                <ul className="flex flex-col gap-1">
                    <li><NavLink to="/prueba/Recepcion" className={estilosDelEnlace}>Recepción</NavLink></li>
                    <li><NavLink to="/prueba/Servicios" className={estilosDelEnlace}>Servicios y Precios</NavLink></li>                  
                    <li><NavLink to="/prueba/Inventario" className={estilosDelEnlace}>Inventario y Repuestos</NavLink></li>
                    <li><NavLink to="/prueba/GestionEmpleados" className={estilosDelEnlace}>Gestión de Empleados</NavLink></li>
                    <li><NavLink to="/prueba/Facturacion" className={estilosDelEnlace}>Facturación</NavLink></li>
                    <li><NavLink to="/prueba/Egresos_Gastos" className={estilosDelEnlace}>Egresos y Gastos</NavLink></li>
                    <li><NavLink to="/prueba/Reportes" className={estilosDelEnlace}>Reportes</NavLink></li>
                </ul>
            </nav>
        </aside>
    );
};
