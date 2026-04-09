import { Link } from 'react-router-dom';

export const Reportes = () => {
    return (
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-2rem)] font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
                    Módulo de <span className="text-[#F43F5E]">Reportes</span>
                </h1>
                <p className="text-slate-500 mb-8 border-b pb-4">
                    Selecciona el reporte estratégico que deseas generar. La información vital de tu taller en un solo lugar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card Resumen Financiero */}
                    <Link to="/panel/Resumen-Financiero" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <div className="w-12 h-12 bg-rose-100 text-[#F43F5E] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#F43F5E] transition-colors">Resumen de Salud Financiera</h2>
                        <p className="text-sm text-slate-500 flex-grow">
                            Balance general, ingresos vs egresos, flujo de caja actual y estado general de las finanzas del taller.
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-indigo-600">
                            Generar reporte
                            <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </Link>

                    {/* Card Servicios más Rentables - AHORA CON PALETA FUCSIA */}
                    <Link to="/panel/servicios-rentables" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <div className="w-12 h-12 bg-rose-100 text-[#F43F5E] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#F43F5E] transition-colors">Servicios más Rentables</h2>
                        <p className="text-sm text-slate-500 flex-grow">
                            Análisis detallado de qué servicios generan mayor margen de ganancia neta para el taller.
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-[#F43F5E]">
                            Ver análisis
                            <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </Link>

                    {/* Reporte de Inventario (Mockup) */}
                    <div className="flex flex-col bg-slate-50 rounded-3xl p-6 border border-dashed border-slate-300 opacity-60">
                        <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-600 mb-2">Reporte de Inventario</h2>
                        <p className="text-sm text-slate-500 flex-grow">
                            Piezas más rotadas, alertas de stock bajo y valoración total del inventario.
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center text-sm font-medium text-slate-400">
                            Próximamente
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};