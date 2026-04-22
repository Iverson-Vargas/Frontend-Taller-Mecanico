import React from 'react';
import { Link } from 'react-router-dom';

export const ServiciosRentables = () => {
    const datosRentabilidad = [
        { id: 1, servicio: "Afinación Mayor", ingresos: 4500, gastos: 1200, margen: 3300, porcentaje: "73%" },
        { id: 2, servicio: "Cambio de Frenos", ingresos: 2800, gastos: 1100, margen: 1700, porcentaje: "60%" },
        { id: 3, servicio: "Escaneo Computarizado", ingresos: 800, gastos: 50, margen: 750, porcentaje: "93%" },
        { id: 4, servicio: "Reparación de Suspensión", ingresos: 5500, gastos: 3200, margen: 2300, porcentaje: "41%" },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-2rem)] font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/panel/reportes" className="group p-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-rose-50 transition-all">
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-[#F43F5E] group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-800">
                        Análisis de <span className="text-[#F43F5E]">Rentabilidad</span>
                    </h1>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-700 uppercase tracking-wider text-sm">Margen neto por servicio</h2>
                        <span className="bg-rose-100 text-[#F43F5E] text-xs font-bold px-3 py-1 rounded-full">Vista Estratégica</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-400 text-xs font-semibold uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-center">#</th>
                                    <th className="px-6 py-4">Servicio Técnico</th>
                                    <th className="px-6 py-4 text-right">Ingresos</th>
                                    <th className="px-6 py-4 text-right">Costos</th>
                                    <th className="px-6 py-4 text-right text-[#F43F5E]">Ganancia Neta</th>
                                    <th className="px-6 py-4 text-center">Margen %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {datosRentabilidad.map((item) => (
                                    <tr key={item.id} className="hover:bg-rose-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-center text-slate-400 font-medium">{item.id}</td>
                                        <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-[#F43F5E] transition-colors">{item.servicio}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">${item.ingresos}</td>
                                        <td className="px-6 py-4 text-right text-slate-400">-${item.gastos}</td>
                                        <td className="px-6 py-4 text-right font-extrabold text-slate-900">${item.margen}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-[#F43F5E] h-full" style={{ width: item.porcentaje }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-[#F43F5E]">{item.porcentaje}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Banner de acción con el color fucsia corporativo */}
                <div className="mt-8 p-6 bg-[#F43F5E] rounded-3xl text-white shadow-lg shadow-rose-200 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">Optimización de Servicios</h3>
                        <p className="text-rose-100 text-sm opacity-90">Los datos muestran que los servicios preventivos generan el 60% de tu utilidad neta.</p>
                    </div>
                    <button className="mt-4 md:mt-0 bg-white text-[#F43F5E] px-8 py-3 rounded-2xl font-bold hover:bg-rose-50 transition-colors shadow-sm">
                        Exportar Reporte
                    </button>
                </div>
            </div>
        </div>
    );
};