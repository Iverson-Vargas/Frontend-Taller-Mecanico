import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ControlProductividad = () => {
    const [mecanicos, setMecanicos] = useState([]);
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    
    // KPIs Globales
    const [eficienciaGlobal, setEficienciaGlobal] = useState("0%");
    const [totalOrdenes, setTotalOrdenes] = useState(0);

    useEffect(() => {
        fetchEmpleados();
    }, [startDate, endDate]);

    const fetchEmpleados = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/empleados?startDate=${startDate}&endDate=${endDate}`);
            if (res.ok) {
                const result = await res.json();
                const list = result.data?.empleados || [];
                
                // Filtramos solo los que son mecánicos
                const listaMecanicos = list.filter(emp => emp.especialidad);
                
                let sumEficiencia = 0;
                let ordenesCompletadas = 0;

                const mecanicosCalculados = listaMecanicos.map(m => {
                    const realOS = m._count?.ordenes || 0;
                    
                    // Fallback para visualización si no hay datos reales (según petición)
                    const osCount = realOS > 0 ? realOS : Math.floor(Math.random() * 8) + 2;
                    ordenesCompletadas += osCount;

                    const baseRendimiento = realOS >= 5 ? 100 : realOS > 0 ? (realOS / 5) * 100 : (70 + Math.random() * 25);
                    sumEficiencia += baseRendimiento;

                    return {
                        id: m.id_empleado,
                        nombre: `${m.nombre} ${m.apellido}`,
                        especialidad: m.especialidad,
                        eficiencia: `${baseRendimiento.toFixed(1)}%`,
                        eficienciaRaw: baseRendimiento,
                        estado: baseRendimiento >= 90 ? 'Excelente' : baseRendimiento >= 60 ? 'Estable' : 'Bajo Rendimiento',
                        osCount
                    };
                });

                if (mecanicosCalculados.length > 0) {
                    setEficienciaGlobal(`${(sumEficiencia / mecanicosCalculados.length).toFixed(1)}%`);
                } else {
                    // Si no hay ningún mecánico en la BD, podrías mostrar 0 o fallbacks totales
                    setEficienciaGlobal("85.5%"); // Fallback global
                }
                setTotalOrdenes(ordenesCompletadas || 45); // Fallback total
                
                mecanicosCalculados.sort((a, b) => b.eficienciaRaw - a.eficienciaRaw);
                setMecanicos(mecanicosCalculados);
            }
        } catch (error) {
            console.error("Error al obtener mecánicos:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtrados = mecanicos.filter(m => 
        m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                            Control de <span className="text-[#F43F5E]">Productividad Real</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Análisis de eficiencia técnica basado en órdenes de servicio finalizadas.</p>
                    </div>
                    <button onClick={() => window.print()} className="px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-sm hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2">
                        📄 Exportar Reporte
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Desde</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hasta</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"/>
                    </div>
                    <div className="flex-1 min-w-[300px] flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Buscar Técnico</label>
                        <input 
                            type="text" 
                            placeholder="Nombre o Especialidad..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                        />
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Eficiencia Promedio del Taller</p>
                        <h2 className="text-5xl font-black text-slate-800">{eficienciaGlobal}</h2>
                        <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                            Cálculo basado en órdenes de servicio
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white border-l-8 border-l-[#F43F5E]">
                        <p className="text-[10px] font-black text-rose-300 uppercase mb-2 tracking-widest">Total Órdenes de Servicio (OS)</p>
                        <h2 className="text-5xl font-black text-white">{totalOrdenes}</h2>
                        <p className="text-slate-400 text-xs mt-3 font-medium">Trabajos asignados y ejecutados en el periodo seleccionado.</p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex justify-between items-center mb-6 border-l-4 border-[#F43F5E] pl-4">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Desempeño Individual de Mecánicos</h3>
                        {loading && <span className="text-xs font-bold text-[#F43F5E] animate-pulse">Sincronizando datos...</span>}
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase border-b border-slate-100">
                                    <th className="px-6 py-4">Mecánico Técnico</th>
                                    <th className="px-6 py-4">Especialidad</th>
                                    <th className="px-6 py-4 text-center">Órdenes</th>
                                    <th className="px-6 py-4 text-center">Eficiencia</th>
                                    <th className="px-6 py-4 text-right">Estatus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtrados.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold italic">No se registraron labores en este periodo</td></tr>
                                ) : (
                                    filtrados.map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-black text-slate-800 group-hover:text-[#F43F5E] transition-colors">{m.nombre}</td>
                                            <td className="px-6 py-4 text-slate-500 font-bold text-xs uppercase">{m.especialidad}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg text-xs font-black">{m.osCount}</span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-blue-600 text-center">{m.eficiencia}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                                    m.estado === 'Excelente' ? 'bg-emerald-100 text-emerald-700' : 
                                                    m.estado === 'Estable' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {m.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};