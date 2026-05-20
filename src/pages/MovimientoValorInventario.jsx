import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios.js';
import * as XLSX from 'xlsx';

export const MovimientoValorInventario = () => {
    const navigate = useNavigate();
    
    const getFirstDayOfMonth = () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    };
    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const [inventario, setInventario] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    
    // KPIs calculados
    const [valorTotal, setValorTotal] = useState(0);
    const [articulosStock, setArticulosStock] = useState(0);

    const mostrarFeedback = (mensaje, tipo = "ok") => {
        setFeedback({ visible: true, mensaje, tipo });
        setTimeout(() => setFeedback(null), 4500);
    };

    useEffect(() => {
        fetchInventario();
    }, [startDate, endDate]);

    const fetchInventario = async () => {
        setLoading(true);
        try {
            const res = await api.get('/inventario', {
                params: { startDate, endDate }
            });
            const payload = res.data.data || res.data;
            
            // Extracción Inteligente
            let list = [];
            if (Array.isArray(payload)) list = payload;
            else if (payload && Array.isArray(payload.repuestos)) list = payload.repuestos;
            else if (payload && Array.isArray(payload.inventario)) list = payload.inventario;

            // Eliminado el Fallback de Mocks. Ahora mostramos los datos reales.
            setInventario(list);
            
            let totalValor = 0;
            let totalArticulos = 0;
            list.forEach(item => {
                const stock = Number(item.stock_actual || 0);
                const precio = Number(item.precio_venta_sugerido || item.precio_compra || 0);
                totalArticulos += stock;
                totalValor += (stock * precio);
            });
            
            setValorTotal(totalValor);
            setArticulosStock(totalArticulos);
        } catch (error) {
            console.error("Error al obtener inventario:", error);
            mostrarFeedback(error.response?.data?.error || "Error al conectar con la base de datos", "error");
        } finally {
            setLoading(false);
        }
    };

    const filtrados = inventario.filter(item => 
        (item.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.id_repuesto).includes(searchTerm) ||
        (item.codigo_barra || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
    };

    const exportarExcel = () => {
        const filas = [
            ["Ref. / Codigo", "Descripcion del Repuesto", "Stock", "Precio Unit.", "Valorizado"],
            ...filtrados.map(item => {
                const stock = Number(item.stock_actual || 0);
                const precio = Number(item.precio_venta_sugerido || item.precio_compra || 0);
                const total = stock * precio;
                return [
                    `#${item.id_repuesto} / ${item.codigo_barra || 'N/A'}`,
                    item.descripcion,
                    stock,
                    precio,
                    total
                ];
            }),
            ["", "", "", "", ""],
            ["Valor Capitalizado", "", "", "", valorTotal],
            ["Unidades Totales", "", "", "", articulosStock]
        ];

        const ws = XLSX.utils.aoa_to_sheet(filas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventario");
        XLSX.writeFile(wb, `Inventario_${startDate}_a_${endDate}.xlsx`);
    };

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-6 font-sans relative">
            
            {/* Toast Notificación */}
            {feedback && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-[200]`} style={feedbackStyles[feedback.tipo]}>
                    <p className="font-bold text-sm tracking-wide">{feedback.mensaje}</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* ENCABEZADO */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                            Valorización de <span className="text-[#F43F5E]">Inventario Real</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Auditoría técnica de existencias y valor monetario del stock en almacén.
                        </p>
                    </div>
                    <button onClick={exportarExcel} className="cursor-pointer bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        📄 Exportar Reporte
                    </button>
                </header>

                {/* Filtros */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Desde la fecha</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-[#F43F5E] transition-all cursor-pointer"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Hasta la fecha</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-[#F43F5E] transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full flex flex-col gap-1 relative">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Buscar en almacén</label>
                            {loading && <span className="text-[10px] font-black text-[#F43F5E] animate-pulse">Sincronizando...</span>}
                        </div>
                        <input 
                            type="text" 
                            placeholder="Nombre del repuesto o código ID..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E] transition-all"
                        />
                    </div>
                </div>

                {/* KPI DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-l-8 border-l-blue-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Valor Capitalizado</h3>
                        <p className="text-5xl font-black text-slate-800 relative z-10">{formatter.format(valorTotal)}</p>
                        <p className="text-xs text-slate-400 mt-2 font-medium relative z-10">Inversión total basada en precio de venta sugerido.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-l-8 border-l-emerald-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Unidades Totales</h3>
                        <p className="text-5xl font-black text-slate-800 relative z-10">{articulosStock} <span className="text-xl text-slate-400 font-bold">Pzs</span></p>
                        <p className="text-xs text-slate-400 mt-2 font-medium relative z-10">Suma total de artículos físicos disponibles.</p>
                    </div>
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">
                            Desglose de existencias y precios
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        {filtrados.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center">
                                <p className="text-slate-400 font-bold italic">No se encontraron artículos en el inventario.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Ref. / Código</th>
                                        <th className="px-6 py-4">Descripción del Repuesto</th>
                                        <th className="px-6 py-4 text-center">Stock</th>
                                        <th className="px-6 py-4 text-right">Precio Unit.</th>
                                        <th className="px-6 py-4 text-right">Valorizado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtrados.map(item => {
                                        const stock = Number(item.stock_actual || 0);
                                        const precio = Number(item.precio_venta_sugerido || item.precio_compra || 0);
                                        const total = stock * precio;
                                        const esBajoStock = stock < (item.stock_minimo || 5);
                                        
                                        return (
                                            <tr key={item.id_repuesto} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 text-xs font-black text-slate-400 font-mono tracking-tighter">
                                                    #{item.id_repuesto} <br/>
                                                    <span className="text-[9px] text-slate-300">{item.codigo_barra || 'N/A'}</span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-slate-800 group-hover:text-[#F43F5E] transition-colors">
                                                    {item.descripcion}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                                                        esBajoStock ? 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                    }`}>
                                                        {stock} {esBajoStock ? '¡REORDER!' : 'OK'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-slate-600 font-bold">{formatter.format(precio)}</td>
                                                <td className="px-6 py-4 text-right font-black text-slate-900">{formatter.format(total)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovimientoValorInventario;
