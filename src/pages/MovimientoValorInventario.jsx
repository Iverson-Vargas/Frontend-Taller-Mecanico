import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MovimientoValorInventario = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* ENCABEZADO */}
                <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <button 
                            onClick={() => navigate('/panel/Reportes')} 
                            className="mb-4 text-slate-500 hover:text-[#F43F5E] text-sm font-bold flex items-center gap-1 transition-colors"
                        >
                            ← Volver a Reportes
                        </button>
                        <h1 className="text-3xl text-slate-800 font-extrabold m-0">
                            Movimiento y <span className="text-[#F43F5E]">Valor del Inventario</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1.5 font-medium">
                            Análisis detallado de entradas, salidas y valorización actual del stock (Vista Preliminar).
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold border border-indigo-100">
                            Periodo: Abril 2026
                        </span>
                    </div>
                </header>

                {/* KPI DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500 hover:shadow-md transition-shadow">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Total Inventario</h3>
                        <p className="text-3xl font-extrabold text-slate-800">$45,230</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Artículos en Stock</h3>
                        <p className="text-3xl font-extrabold text-slate-800">1,245 <span className="text-sm text-slate-500 font-medium">uds</span></p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-amber-500 hover:shadow-md transition-shadow">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Entradas del Mes</h3>
                        <p className="text-3xl font-extrabold text-slate-800">+ 320 <span className="text-sm text-slate-500 font-medium">uds</span></p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-rose-500 hover:shadow-md transition-shadow">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Salidas del Mes</h3>
                        <p className="text-3xl font-extrabold text-slate-800">- 185 <span className="text-sm text-slate-500 font-medium">uds</span></p>
                    </div>
                </div>

                {/* GRÁFICOS PLACEHOLDERS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">Evolución del Valor (Últimos 6 Meses)</h3>
                        <div className="h-64 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
                            {/* Simulación de gráfico de barras */}
                            <div className="w-1/6 bg-indigo-100 flex flex-col justify-end rounded-t-sm hover:bg-indigo-200 transition-colors" style={{ height: '60%' }}><div className="bg-indigo-500 h-1 w-full" /></div>
                            <div className="w-1/6 bg-indigo-100 flex flex-col justify-end rounded-t-sm hover:bg-indigo-200 transition-colors" style={{ height: '65%' }}><div className="bg-indigo-500 h-1 w-full" /></div>
                            <div className="w-1/6 bg-indigo-100 flex flex-col justify-end rounded-t-sm hover:bg-indigo-200 transition-colors" style={{ height: '50%' }}><div className="bg-indigo-500 h-1 w-full" /></div>
                            <div className="w-1/6 bg-indigo-100 flex flex-col justify-end rounded-t-sm hover:bg-indigo-200 transition-colors" style={{ height: '75%' }}><div className="bg-indigo-500 h-1 w-full" /></div>
                            <div className="w-1/6 bg-indigo-100 flex flex-col justify-end rounded-t-sm hover:bg-indigo-200 transition-colors" style={{ height: '85%' }}><div className="bg-indigo-500 h-1 w-full" /></div>
                            <div className="w-1/6 bg-indigo-500 flex flex-col justify-end rounded-t-sm shadow-md cursor-pointer hover:bg-indigo-600 transition-colors" style={{ height: '100%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 px-2">
                            <span>Nov</span><span>Dic</span><span>Ene</span><span>Feb</span><span>Mar</span><span className="text-indigo-600">Abr</span>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-[#F43F5E] pl-3">Distribución por Categoría</h3>
                        <div className="space-y-4 mt-6">
                            <div>
                                <div className="flex justify-between text-sm mb-1 font-bold"><span className="text-slate-600">Frenos</span><span className="text-slate-800">45%</span></div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1 font-bold"><span className="text-slate-600">Aceites y Filtros</span><span className="text-slate-800">30%</span></div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '30%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1 font-bold"><span className="text-slate-600">Suspensión</span><span className="text-slate-800">15%</span></div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '15%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1 font-bold"><span className="text-slate-600">Otros</span><span className="text-slate-800">10%</span></div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '10%' }}></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABLA DE MOVIMIENTOS RECIENTES */}
                <div className="bg-white p-0 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg text-slate-800 m-0 border-l-4 border-emerald-500 pl-3 font-bold">
                            Detalle de Movimientos Recientes
                        </h2>
                        <button className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-1">
                            Exportar CSV ⬇
                        </button>
                    </div>
                    <div className="overflow-x-auto p-5 pt-0">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Fecha</th>
                                    <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Repuesto</th>
                                    <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Tipo</th>
                                    <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Cantidad</th>
                                    <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Precio Unit.</th>
                                    <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* Filas estáticas para la demostración de UI */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm text-slate-600 font-mono">09-Abr-2026</td>
                                    <td className="p-4 text-sm text-slate-800 font-bold">Pastillas de Freno Bendix</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-md text-xs font-bold w-fit flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Venta
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-800 font-semibold">- 4 uds</td>
                                    <td className="p-4 text-sm text-slate-600">$25.00</td>
                                    <td className="p-4 text-sm font-bold text-slate-800">$100.00</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm text-slate-600 font-mono">08-Abr-2026</td>
                                    <td className="p-4 text-sm text-slate-800 font-bold">Aceite Motor 5W30 (Tambor)</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-xs font-bold w-fit flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Compra
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-800 font-semibold">+ 20 Lts</td>
                                    <td className="p-4 text-sm text-slate-600">$8.50</td>
                                    <td className="p-4 text-sm font-bold text-emerald-600">$170.00</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm text-slate-600 font-mono">07-Abr-2026</td>
                                    <td className="p-4 text-sm text-slate-800 font-bold">Filtro de Aire K&N</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-md text-xs font-bold w-fit flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Ajuste
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-800 font-semibold">- 1 uds</td>
                                    <td className="p-4 text-sm text-slate-600">$15.00</td>
                                    <td className="p-4 text-sm font-bold text-slate-800">$15.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};
