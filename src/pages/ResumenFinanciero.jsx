import { Link } from 'react-router-dom';

export const ResumenFinanciero = () => {
    // Mock Data
    const metrics = {
        ingresosTotales: "$45,231.89",
        ingresosPorcentaje: "+20.1%",
        gastosTotales: "$12,450.00",
        gastosPorcentaje: "-5.4%",
        balanceNeto: "$32,781.89",
        balancePorcentaje: "+15.3%"
    };

    const ultimosMovimientos = [
        { id: 1, concepto: "Mantenimiento Preventivo (Audi A4)", tipo: "ingreso", monto: "$450.00", fecha: "Hoy, 10:30 AM" },
        { id: 2, concepto: "Cambio de Frenos (Honda Civic)", tipo: "ingreso", monto: "$280.00", fecha: "Hoy, 09:15 AM" },
        { id: 3, concepto: "Compra de Repuestos (Aceite y Filtros)", tipo: "egreso", monto: "$1,250.00", fecha: "Ayer" },
        { id: 4, concepto: "Reparación Transmisión (Ford Ranger)", tipo: "ingreso", monto: "$2,100.00", fecha: "Ayer" },
        { id: 5, concepto: "Pago Servicio de Luz", tipo: "egreso", monto: "$150.00", fecha: "Mar 20" },
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
                            <span className="text-slate-800">Balance General</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Resumen de <span className="text-[#F43F5E]">Salud Financiera</span>
                        </h1>
                        <p className="text-slate-500 mt-1">Monitoreo en tiempo real del flujo de caja del taller.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-3 cursor-pointer bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 font-bold text-sm transition-colors flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Exportar PDF
                        </button>
                        <button className="px-5 py-3 cursor-pointer bg-[#F43F5E] text-white rounded-xl shadow-md hover:bg-rose-600 font-bold text-sm transition-all hover:shadow-lg transform active:scale-[0.98]">
                            Generar Nuevo Reporte
                        </button>
                    </div>
                </div>

                {/* Tarjetas de Metricas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Ingresos */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">Ingresos Totales (Mes)</p>
                            <h2 className="text-3xl font-extrabold text-slate-800">{metrics.ingresosTotales}</h2>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-emerald-600 font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                {metrics.ingresosPorcentaje}
                            </span>
                            <span className="text-slate-400 ml-2 font-medium">vs mes anterior</span>
                        </div>
                    </div>

                    {/* Gastos */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-16 h-16 text-[#F43F5E]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">Gastos y Egresos (Mes)</p>
                            <h2 className="text-3xl font-extrabold text-slate-800">{metrics.gastosTotales}</h2>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-indigo-600 font-bold flex items-center bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                                {metrics.gastosPorcentaje}
                            </span>
                            <span className="text-slate-400 ml-2 font-medium">vs mes anterior</span>
                        </div>
                    </div>

                    {/* Balance Neto */}
                    <div className="bg-slate-800 rounded-3xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -bottom-6 -right-6 opacity-10">
                            <svg className="w-32 h-32 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-indigo-300 text-sm font-bold mb-1 border-l-2 border-[#F43F5E] pl-2">Balance Neto (Ganancias)</p>
                            <h2 className="text-4xl font-black text-white mt-2">{metrics.balanceNeto}</h2>
                        </div>
                        <div className="mt-4 flex items-center text-sm relative z-10">
                            <span className="bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-1 rounded-md flex items-center font-bold">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                {metrics.balancePorcentaje}
                            </span>
                            <span className="text-slate-400 ml-2 font-medium">crecimiento orgánico</span>
                        </div>
                    </div>

                </div>

                {/* Sección de Gráfico y Tabla */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Visualización de Gráfica Ficticia */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">Flujo de Caja (Visualización)</h3>
                            <div className="bg-slate-100 rounded-xl p-1 flex">
                                <button className="cursor-pointer px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-slate-800">Este Mes</button>
                                <button className="cursor-pointer px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Últimos 3 Meses</button>
                            </div>
                        </div>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            {/* Placeholder para un chart de verdad en el futuro (ej. Recharts o Chart.js) */}
                            <div className="text-center">
                                <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                                <p className="text-sm text-slate-500 font-medium">Área reservada para gráfica interactiva</p>
                                <p className="text-xs text-slate-400 mt-1 font-semibold">Conexión con el Backend pendiente</p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de últimos movimientos */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-[#F43F5E] pl-3">Últimos Movimientos</h3>
                        <div className="space-y-4">
                            {ultimosMovimientos.map(mov => (
                                <div key={mov.id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 shrink-0 ${mov.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-[#F43F5E]'}`}>
                                            {mov.tipo === 'ingreso' ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 line-clamp-1">{mov.concepto}</p>
                                            <p className="text-xs text-slate-400 font-medium">{mov.fecha}</p>
                                        </div>
                                    </div>
                                    <div className={`font-extrabold text-sm ${mov.tipo === 'ingreso' ? 'text-emerald-600' : 'text-[#F43F5E]'}`}>
                                        {mov.tipo === 'ingreso' ? '+' : '-'}{mov.monto}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="cursor-pointer w-full mt-6 py-3 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                            Ver todo el historial
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
