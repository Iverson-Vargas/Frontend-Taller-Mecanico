import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
    // Estado para saber si estamos en pestaña de Empleado o Cliente
    const [esEmpleado, setEsEmpleado] = useState(true);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full max-w-md overflow-hidden border border-slate-200">
                
                {/* PESTAÑAS (TABS) */}
                <div className="flex border-b border-slate-100">
                    <button 
                        type="button"
                        onClick={() => setEsEmpleado(true)}
                        className={` cursor-pointer flex-1 py-4 text-sm font-bold transition-all outline-none ${
                            esEmpleado 
                            ? 'text-[#F43F5E] border-b-2 border-[#F43F5E] bg-rose-50' 
                            : 'text-slate-400 hover:text-slate-600 bg-white'
                        }`}
                    >
                        EMPLEADOS
                    </button>
                    <button 
                        type="button"
                        onClick={() => setEsEmpleado(false)}
                        className={` cursor-pointer flex-1 py-4 text-sm font-bold transition-all outline-none ${
                            !esEmpleado 
                            ? 'text-[#F43F5E] border-b-2 border-[#F43F5E] bg-rose-50' 
                            : 'text-slate-400 hover:text-slate-600 bg-white'
                        }`}
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

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        {esEmpleado ? (
                            /* --- VISTA EMPLEADOS --- */
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Usuario</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none transition-all text-slate-800 text-sm"
                                        placeholder="ej: amaro123"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none transition-all text-slate-800 text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </>
                        ) : (
                            /* --- VISTA CLIENTES --- */
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase ml-1 block">Número de Cédula</label>
                                <input 
                                    type="text" 
                                    inputMode="numeric"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none transition-all text-slate-800 text-sm"
                                    placeholder="28123456"
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                                    }}
                                />
                            </div>
                        )}

                        {/* Botón Principal */}
                        <button className="w-full mt-2 bg-[#F43F5E] hover:bg-rose-600 text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] border-none p-0 overflow-hidden">
                            <Link 
                                to={esEmpleado ? "/prueba/Recepcion" : "/estado-cliente"} 
                                className=" block w-full py-3.5 text-center text-sm tracking-wide"
                                style={{ textDecoration: 'none', color: 'white' }}
                            >
                                {esEmpleado ? "ENTRAR AL SISTEMA" : "CONSULTAR ESTADO"}
                            </Link>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};