import React, { useState, useEffect } from 'react';
import api from '../services/axios.js';
import * as XLSX from 'xlsx';

export const ServiciosRentables = () => {
    const [datosRentabilidad, setDatosRentabilidad] = useState([]);
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const mostrarFeedback = (mensaje, tipo = "ok") => {
        setFeedback({ visible: true, mensaje, tipo });
        setTimeout(() => setFeedback(null), 4500);
    };

    useEffect(() => {
        fetchRentabilidad();
    }, [startDate, endDate]);

    const fetchRentabilidad = async () => {
        setIsLoading(true);
        try {
            // GET /api/reportes/rentabilidad-servicios
            const res = await api.get(`/reportes/rentabilidad-servicios?startDate=${startDate}&endDate=${endDate}`);
            const payload = res.data.data || res.data;
            
            // Extracción Inteligente
            let list = [];
            if (Array.isArray(payload)) list = payload;
            else if (payload && Array.isArray(payload.servicios)) list = payload.servicios;
            
            const datosMapeados = list.map(s => ({
                id_servicio: s.id_servicio,
                servicio: s.nombre || s.nombre_servicio || 'Servicio sin nombre',
                ingresos: s.ingreso_total || 0,
                gastos: 0, 
                margen: s.ingreso_total || 0,
                porcentaje: "100%"
            }));
            
            // Reemplazo de los fallbacks por los datos reales.
            setDatosRentabilidad(datosMapeados);
            
        } catch (error) {
            console.error("Error al obtener la rentabilidad de servicios:", error);
            mostrarFeedback(error.response?.data?.error || "Error de conexión al cargar rentabilidad", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const filtrados = datosRentabilidad.filter(d => 
        (d.servicio || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
    };

    const exportarExcel = () => {
        const filas = [
            ["#", "Servicio Tecnico Realizado", "Ingresos ($)", "Ganancia Neta", "Rendimiento %"],
            ...filtrados.map((item, index) => [
                index + 1,
                item.servicio,
                Number(item.ingresos || 0),
                Number(item.margen || 0),
                item.porcentaje || '100%'
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(filas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rentabilidad");
        XLSX.writeFile(wb, `Rentabilidad_Servicios_${startDate}_a_${endDate}.xlsx`);
    };

    return (
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-2rem)] font-sans relative">
            
            {/* Toast Notificación */}
            {feedback && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-[200]`} style={feedbackStyles[feedback.tipo]}>
                    <p className="font-bold text-sm tracking-wide">{feedback.mensaje}</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Análisis de <span className="text-[#F43F5E]">Rentabilidad</span>
                    </h1>
                    <button onClick={exportarExcel} className="cursor-pointer bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
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
                    <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Buscar Servicio</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Cambio de Aceite..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-black text-slate-800 uppercase tracking-wider text-xs">Margen neto consolidado por servicio</h2>
                        {isLoading ? <span className="text-xs font-bold text-[#F43F5E] animate-pulse">Sincronizando...</span> : <span className="bg-rose-100 text-[#F43F5E] text-[10px] font-black px-3 py-1 rounded-full uppercase">Datos en tiempo real</span>}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-center">#</th>
                                    <th className="px-6 py-4">Servicio Técnico Realizado</th>
                                    <th className="px-6 py-4 text-right">Ingresos ($)</th>
                                    <th className="px-6 py-4 text-right text-[#F43F5E]">Ganancia Neta</th>
                                    <th className="px-6 py-4 text-center">Rendimiento %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtrados.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold italic">No se facturaron servicios en este periodo.</td></tr>
                                ) : (
                                    filtrados.map((item, index) => (
                                        <tr key={item.id_servicio || index} className="hover:bg-rose-50/50 transition-colors group">
                                            <td className="px-6 py-4 text-center text-slate-400 font-bold">{index + 1}</td>
                                            <td className="px-6 py-4 font-black text-slate-800 group-hover:text-[#F43F5E] transition-colors">{item.servicio}</td>
                                            <td className="px-6 py-4 text-right text-slate-600 font-bold">${Number(item.ingresos || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right font-black text-slate-900">${Number(item.margen || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-[#F43F5E] h-full" style={{ width: item.porcentaje || '100%' }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#F43F5E]">{item.porcentaje || '100%'}</span>
                                                </div>
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

export default ServiciosRentables;
