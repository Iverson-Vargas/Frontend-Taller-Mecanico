import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    // 1. Estados para la lógica
    const [esEmpleado, setEsEmpleado] = useState(true);
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [cedula, setCedula] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    // 2. Función de conexión al Backend
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const url = esEmpleado ? 'http://localhost:3000/api/login' : 'http://localhost:3000/api/clientes/consulta';
        const body = esEmpleado ? { usuario: user, password: pass } : { cedula };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                navigate(esEmpleado ? "/prueba/Recepcion" : "/estado-cliente");
            } else {
                setError(data.mensaje || "Error al entrar");
            }
        } catch (err) {
            setError("Servidor fuera de línea");
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
                        className={`flex-1 py-4 text-sm font-bold transition-all outline-none ${esEmpleado ? 'text-[#F43F5E] border-b-2 border-[#F43F5E] bg-rose-50' : 'text-slate-400 bg-white'}`}
                    >
                        EMPLEADOS
                    </button>
                    <button 
                        type="button"
                        onClick={() => setEsEmpleado(false)} 
                        className={`flex-1 py-4 text-sm font-bold transition-all outline-none ${!esEmpleado ? 'text-[#F43F5E] border-b-2 border-[#F43F5E] bg-rose-50' : 'text-slate-400 bg-white'}`}
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
                        {esEmpleado ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Usuario</label>
                                    <input 
                                        type="text" 
                                        value={user}
                                        onChange={(e) => setUser(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm"
                                        placeholder="ej: amaro123"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Contraseña</label>
                                    <input 
                                        type="password" 
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Número de Cédula</label>
                                <input 
                                    type="text" 
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm"
                                    placeholder="28123456"
                                    required
                                />
                            </div>
                        )}

                        {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

                        <button 
                            type="submit" 
                            className="w-full py-3.5 bg-[#F43F5E] hover:bg-rose-600 text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] border-none cursor-pointer"
                        >
                            {esEmpleado ? "ENTRAR AL SISTEMA" : "CONSULTAR ESTADO"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};