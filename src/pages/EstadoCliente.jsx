import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EstadoCliente = () => {
    const navigate = useNavigate();
    const [clienteData, setClienteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cedula = localStorage.getItem('clienteCedula');

    useEffect(() => {
        if (!cedula) {
            navigate('/');
            return;
        }

        const fetchEstado = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/clientes/consulta/${cedula}`);
                if (!res.ok) {
                    throw new Error('No se pudo obtener la información de su vehículo');
                }
                const data = await res.json();
                setClienteData(data);
            } catch (err) {
                setError(err.message || 'Error de conexión con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchEstado();
    }, [cedula, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('clienteCedula');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 font-sans flex flex-col items-center">
            <header className="w-full max-w-4xl flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Taller App</h1>
                    <p className="text-slate-500 text-sm">Consulta de Estado de Vehículo</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className=" cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                    Cerrar Sesión
                </button>
            </header>

            <main className="w-full max-w-4xl bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#F43F5E] mb-4"></div>
                        <p className="text-slate-500 font-medium">Buscando información...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 text-rose-600 p-6 rounded-xl text-center border border-rose-200 py-12">
                        <svg className="w-12 h-12 mx-auto mb-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <h3 className="text-lg font-bold mb-2">Ha ocurrido un problema</h3>
                        <p>{error}</p>
                    </div>
                ) : clienteData ? (
                    <div className="space-y-8 animate-fade-in">
                        <div className="border-b border-slate-100 pb-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Estado de su Vehículo</h2>
                                <p className="text-slate-500 mt-1 font-medium">Documento de Identidad: <span className="text-slate-700">{cedula}</span></p>
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold border border-emerald-100 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                Información Actualizada
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Renderizar dinámicamente todo lo que devuelva el back */}
                            {Object.entries(clienteData).map(([key, value]) => {
                                // Evitar objetos internos, renderizamos sus propiedades si es necesario
                                if (typeof value === 'object' && value !== null) {
                                  return (
                                    <div key={key} className="col-span-full bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <h3 className="font-bold text-slate-800 capitalize mb-4 text-lg border-b border-slate-200 pb-2">{key.replace(/_/g, ' ')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                            {Object.entries(value).map(([subKey, subVal]) => (
                                                <div key={subKey} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{subKey.replace(/_/g, ' ')}</span>
                                                    <span className="block font-medium text-slate-800 text-base">{String(subVal)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                  )
                                }
                                return (
                                    <div key={key} className="bg-slate-50 p-5 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                                        <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-wider mb-1">{key.replace(/_/g, ' ')}</p>
                                        <p className="text-lg font-semibold text-slate-800 truncate" title={String(value)}>{String(value)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-slate-500 py-12">No hay datos disponibles vinculados a esta cédula.</p>
                )}
            </main>
        </div>
    );
};
