import { Link } from 'react-router-dom';

export const ControlProductividad = () => {
    // Datos estáticos (Mock Data) para que la tabla no se vea vacía hoy
    const mecanicos = [
        { id: 1, nombre: "Juan Pérez", especialidad: "Motores", eficiencia: "94%", horas: "160/165", estado: "Excelente" },
        { id: 2, nombre: "Ricardo Gómez", especialidad: "Frenos", eficiencia: "82%", horas: "145/160", estado: "Estable" },
        { id: 3, nombre: "Carlos Ruiz", especialidad: "Electrónica", eficiencia: "75%", horas: "120/160", estado: "Bajo Rendimiento" },
        { id: 4, nombre: "Luis Torres", especialidad: "Transmisiones", eficiencia: "91%", horas: "155/165", estado: "Excelente" },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Cabecera y Navegación */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center text-sm text-slate-500 mb-2 font-semibold">
                            <Link to="/panel/Reportes" className="hover:text-[#F43F5E] transition-colors">Reportes</Link>
                            <span className="mx-2">/</span>
                            <span className="text-slate-800">Control de Productividad</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Control de <span className="text-[#F43F5E]">Productividad</span>
                        </h1>
                        <p className="text-slate-500 mt-1">Análisis de eficiencia y cumplimiento de tiempos por mecánico.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 font-bold text-sm transition-colors flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Exportar PDF
                        </button>
                    </div>
                </div>

                {/* Tarjetas de Métricas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
                        <p className="text-sm font-bold text-slate-500 mb-1">Eficiencia Global</p>
                        <h2 className="text-3xl font-extrabold text-slate-800">88.5%</h2>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">+4.2% vs mes anterior</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <p className="text-sm font-bold text-slate-500 mb-1">Total Horas Facturadas</p>
                        <h2 className="text-3xl font-extrabold text-slate-800">580 hrs</h2>
                        <div className="mt-4 flex items-center text-sm text-slate-400 font-medium">
                            Meta mensual: 640 hrs
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-3xl p-6 shadow-lg text-white">
                        <p className="text-indigo-300 text-sm font-bold mb-1 border-l-2 border-[#F43F5E] pl-2">Índice de Retorno</p>
                        <h2 className="text-3xl font-black text-white mt-2">1.5%</h2>
                        <p className="text-slate-400 text-xs mt-2 font-medium">Bajo el límite de alerta (3%)</p>
                    </div>

                </div>

                {/* Tabla de Detalle Individual */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-blue-500 pl-3">Desempeño Individual por Técnico</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                                    <th className="pb-4 font-bold">Mecánico</th>
                                    <th className="pb-4 font-bold">Especialidad</th>
                                    <th className="pb-4 font-bold">Eficiencia</th>
                                    <th className="pb-4 font-bold">Horas (Fact/Disp)</th>
                                    <th className="pb-4 font-bold">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {mecanicos.map(m => (
                                    <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-bold text-slate-700">{m.nombre}</td>
                                        <td className="py-4 text-slate-500">{m.especialidad}</td>
                                        <td className="py-4 font-extrabold text-blue-600">{m.eficiencia}</td>
                                        <td className="py-4 text-slate-600 font-medium">{m.horas}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                m.estado === 'Excelente' ? 'bg-emerald-100 text-emerald-700' : 
                                                m.estado === 'Estable' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                            }`}>
                                                {m.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};