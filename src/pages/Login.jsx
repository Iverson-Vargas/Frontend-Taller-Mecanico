import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios.js";

export const Login = () => {
    const navigate = useNavigate();
    const [esEmpleado, setEsEmpleado] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cedula, setCedula] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (esEmpleado && (!username || !password)) {
            setError("Por favor ingresa usuario y contraseña");
            return;
        }
        if (!esEmpleado && !cedula) {
            setError("Por favor ingresa tu cédula");
            return;
        }

        setLoading(true);

        try {
            if (esEmpleado) {
                // ── Flujo Empleado ──────────────────────────────────────────
                // POST /api/auth/login → { success, message, data: { empleado: { ... } } }
                const res = await api.post('/auth/login', {
                    usuario: username,
                    password
                });

                const { empleado } = res.data.data;
                const permisos = empleado.permisos || {};

                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'empleado');
                localStorage.setItem('usuario', JSON.stringify({
                    cedula_rif: empleado.cedula_rif,
                    nombre: `${empleado.nombre} ${empleado.apellido ?? ''}`.trim(),
                    rol: empleado.cargo,
                    permisos
                }));

                // Redirigir al primer módulo disponible según permisos
                if (permisos.admin_caja) {
                    navigate('/panel/GestionEmpleados');
                } else if (permisos.recepcion) {
                    navigate('/panel/Orden-Servicio');
                } else if (permisos.mecanico) {
                    navigate('/panel/Lista-Servicio');
                } else {
                    navigate('/panel/Lista-Servicio'); // fallback
                }

            } else {
                // ── Flujo Cliente ───────────────────────────────────────────
                // GET /api/clientes/consulta/:cedula → { success, message, data: { ... } }
                const res = await api.get(`/clientes/consulta/${cedula.trim()}`);

                const clienteData = res.data.data;

                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'cliente');
                localStorage.setItem('clienteCedula', cedula.trim());
                // Objeto de sesión estándar (mismo esquema que el empleado)
                localStorage.setItem('usuario', JSON.stringify({
                    cedula_rif: clienteData.cedula_rif ?? cedula.trim(),
                    nombre: clienteData.nombre ?? 'Cliente',
                    rol: 'cliente'
                }));

                navigate('/estado-cliente');
            }

        } catch (err) {
            // Errores de validación 400 con array de errores
            if (err.response?.status === 400 && err.response.data?.errors) {
                const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                setError(msgs);
            } else {
                // Error de negocio estándar: { success: false, error: "..." }
                setError(
                    err.response?.data?.error ||
                    'Error de conexión con el servidor'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden border border-slate-200">

                {/* PESTAÑAS (TABS) */}
                <div className="flex border-b border-slate-100">
                    <button
                        type="button"
                        onClick={() => setEsEmpleado(true)}
                        className={`cursor-pointer flex-1 py-4 text-sm font-bold transition-all outline-none ${esEmpleado ? 'text-[#F43F5E] border-b-2 border-[#F43F5E] bg-rose-50' : 'text-slate-400 bg-white'}`}
                    >
                        EMPLEADOS
                    </button>
                    <button
                        type="button"
                        onClick={() => setEsEmpleado(false)}
                        className={`cursor-pointer flex-1 py-4 text-sm font-bold transition-all outline-none ${!esEmpleado ? 'text-[#F43F5E] border-b-2 border-[#F43F5E] bg-rose-50' : 'text-slate-400 bg-white'}`}
                    >
                        CLIENTES
                    </button>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2 text-center">
                        {esEmpleado ? "Gestión de Taller" : "Consulta tu Vehículo"}
                    </h2>
                    <p className="text-slate-500 text-sm text-center mb-8 font-medium">
                        {esEmpleado ? "Ingresa tus credenciales de acceso" : "Introduce tu cédula para ver el estado"}
                    </p>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-200">
                                {error}
                            </div>
                        )}
                        {esEmpleado ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Usuario</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm transition-all text-slate-800"
                                        placeholder="admin@taller.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm transition-all text-slate-800"
                                            placeholder="********"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-[#F43F5E] transition-colors"
                                            tabIndex={-1}
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showPassword ? (
                                                /* Ojo tachado - ocultar */
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                /* Ojo abierto - mostrar */
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Número de Cédula</label>
                                <input
                                    type="text"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    inputMode="numeric"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm transition-all text-slate-800"
                                    placeholder="V-28123456"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-2 bg-[#F43F5E] hover:bg-rose-600 text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] border-none p-3.5 text-center text-sm tracking-wide ${loading ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            {loading ? "CARGANDO..." : (esEmpleado ? "ENTRAR AL SISTEMA" : "CONSULTAR ESTADO")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
