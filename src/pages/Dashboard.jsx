import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const navigate = useNavigate();
    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    const permisos = usuario?.permisos || {};
    const rol = usuario?.rol || 'user';
    const cargo = usuario?.cargo || (rol === 'admin' ? 'Administrador' : 'Empleado');
    const nombre = usuario?.nombre || 'Usuario';

    // Accesos rápidos según permisos de la BD
    const accesos = [];

    if (permisos.recepcion || permisos.admin_caja) {
        accesos.push(
            { label: 'Nueva Orden de Servicio', icon: '📋', path: '/panel/Orden-Servicio', color: 'from-rose-500 to-pink-600' },
            { label: 'Registro de Cliente', icon: '👤', path: '/panel/RegistroCliente', color: 'from-violet-500 to-purple-600' },
            { label: 'Lista de Clientes', icon: '📁', path: '/panel/Listado-Clientes', color: 'from-blue-500 to-indigo-600' },
        );
    }
    if (permisos.mecanico || permisos.admin_caja) {
        accesos.push(
            { label: 'Historial de Servicios', icon: '🔧', path: '/panel/Lista-Servicio', color: 'from-amber-500 to-orange-600' },
            { label: 'Inventario', icon: '📦', path: '/panel/Inventario', color: 'from-emerald-500 to-teal-600' },
        );
    }
    if (permisos.admin_caja) {
        accesos.push(
            { label: 'Gestión de Personal', icon: '👥', path: '/panel/GestionEmpleados', color: 'from-cyan-500 to-sky-600' },
            { label: 'Facturación', icon: '💰', path: '/panel/Facturacion', color: 'from-lime-500 to-green-600' },
            { label: 'Reportes', icon: '📊', path: '/panel/Reportes', color: 'from-fuchsia-500 to-rose-600' },
        );
    }
    // Si no tiene ningún permiso definido, mostrar accesos básicos
    if (accesos.length === 0) {
        accesos.push(
            { label: 'Nueva Orden de Servicio', icon: '📋', path: '/panel/Orden-Servicio', color: 'from-rose-500 to-pink-600' },
            { label: 'Historial de Servicios', icon: '🔧', path: '/panel/Lista-Servicio', color: 'from-amber-500 to-orange-600' },
        );
    }

    const hora = new Date().getHours();
    const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

    return (
        <div className="min-h-full">
            {/* Header de bienvenida */}
            <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-2xl p-8 mb-8 border border-slate-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <p className="text-slate-400 text-sm font-medium mb-1">{saludo} 👋</p>
                    <h1 className="text-3xl font-black text-white mb-2">{nombre}</h1>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {cargo}
                    </span>
                </div>
            </div>

            {/* Accesos rápidos */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-700 mb-4">Accesos rápidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accesos.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(item.path)}
                            className={`bg-gradient-to-br ${item.color} text-white p-5 rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 text-left group`}
                        >
                            <span className="text-3xl block mb-3">{item.icon}</span>
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            <svg className="w-4 h-4 mt-2 opacity-60 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info del sistema */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-500 flex items-center gap-3">
                <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Selecciona una opción del menú lateral o usa los accesos rápidos para comenzar a trabajar.</p>
            </div>
        </div>
    );
};
