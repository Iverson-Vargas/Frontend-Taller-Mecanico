import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
    // Estado para saber si estamos en pestaña de Empleado o Cliente
    const [esEmpleado, setEsEmpleado] = useState(true);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
                
                <div className="flex border-b border-gray-100">
                    <button 
                        type="button"
                        onClick={() => setEsEmpleado(true)}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${esEmpleado ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        EMPLEADOS
                    </button>
                    <button 
                        type="button"
                        onClick={() => setEsEmpleado(false)}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${!esEmpleado ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        CLIENTES
                    </button>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        {esEmpleado ? "Gestión de Taller" : "Consulta tu Vehículo"}
                    </h2>
                    <p className="text-gray-500 text-sm text-center mb-8">
                        {esEmpleado ? "Ingresa tus credenciales de acceso" : "Introduce tu cédula para ver el estado"}
                    </p>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        {esEmpleado ? (
                            /* --- VISTA EMPLEADOS --- */
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Usuario</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                        placeholder="ej: amaro123"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </>
                        ) : (
                            /* --- VISTA CLIENTES --- */
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Número de Cédula</label>
                                <input 
                                    type="text" 
                                    inputMode="numeric"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                    placeholder="28123456"
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                                    }}
                                />
                            </div>
                        )}

                        {/* Botón Principal en Rosa */}
                        <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-[0.98]">
                            <Link to={esEmpleado ? "/prueba/Recepcion" : "/estado-cliente"} className="block w-full">
                                {esEmpleado ? "ENTRAR AL SISTEMA" : "CONSULTAR ESTADO"}
                            </Link>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};