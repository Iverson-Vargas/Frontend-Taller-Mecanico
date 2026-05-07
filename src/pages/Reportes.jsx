import { Link } from 'react-router-dom';

export const Reportes = () => {
    return(
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-2rem)] font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
                    Módulo de <span className="text-[#F43F5E]">Reportes</span>
                </h1>
                <p className="text-slate-500 mb-8 border-b pb-4">
                    Selecciona el reporte estratégico que deseas generar. La información vital de tu taller en un solo lugar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                    {/* Card Estado de Resultados (Ganancia) */}
                    <Link to="/panel/ReporteGanancia" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">Estado de Resultados</h2>
                        <p className="text-sm text-slate-500 flex-grow">Análisis de utilidad neta, ingresos brutos y gastos operativos del periodo.</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-emerald-600">
                            Ver Ganancia
                            <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </Link>

                    {/* Card Servicios Rentables */}
                    <Link to="/panel/servicios-rentables" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <div className="w-12 h-12 bg-rose-100 text-[#F43F5E] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#F43F5E] transition-colors">Servicios Más Rentables</h2>
                        <p className="text-sm text-slate-500 flex-grow">Desglose de qué servicios técnicos generan mayor margen de ganancia individual.</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-rose-600">
                            Analizar Margen
                            <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </Link>

                    {/* Card Nóminas */}
                    <Link to="/panel/ReporteNominas" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Nóminas y Comisiones</h2>
                        <p className="text-sm text-slate-500 flex-grow">Liquidación detallada de sueldos, comisiones por órdenes y bonos de técnicos.</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-blue-600">
                            Ver Nómina
                            <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </Link>

                    {/* Card Productividad */}
                    <Link to="/panel/ControlProductividad" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Productividad Personal</h2>
                        <p className="text-sm text-slate-500 flex-grow">Análisis de eficiencia, trabajos completados y rendimiento de cada mecánico.</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-indigo-600">
                            Ver Eficiencia
                            <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </Link>

                    {/* Card Inventario */}
                    <Link to="/panel/MovimientoInventario" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-600 transition-colors">Valoración de Inventario</h2>
                        <p className="text-sm text-slate-500 flex-grow">Estado del stock actual, valoración económica total y alertas de reposición.</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-slate-600">
                            Ver Stock
                            <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    )
}
