import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/axios.js';

export const ResumenFinanciero = () => {
    // --- FILTROS ---
    const [filters, setFilters] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Desde Enero
        endDate: new Date().toISOString().split('T')[0],
        departamento: 'Todos',
        activo: 'Todos'
    });

    // --- DATOS ---
    const [balanceData, setBalanceData] = useState({
        totalIngresos: 0, totalGastos: 0, balanceNeto: 0, valorInventario: 0, pasivos: 0
    });
    const [movimientos, setMovimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    const mostrarFeedback = (mensaje, tipo = "ok") => {
        setFeedback({ visible: true, mensaje, tipo });
        setTimeout(() => setFeedback(null), 4500);
    };

    // --- CARGA DE DATOS ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Balance
            const resB = await api.get('/reportes/balance');
            const b = resB.data.data || resB.data;
            setBalanceData({
                totalIngresos: b.activos?.caja_bancos || 0,
                totalGastos: b.total_gastos || 0,
                balanceNeto: b.patrimonio || 0,
                valorInventario: b.activos?.inventario || 0,
                pasivos: b.pasivos?.total || 0
            });

            // 2. Facturas y Gastos
            const [resF, resG] = await Promise.all([
                api.get('/facturas'),
                api.get('/gastos')
            ]);

            const payloadF = resF.data.data || resF.data;
            const payloadG = resG.data.data || resG.data;

            // Mapeo robusto (Extracción Inteligente)
            let listF = [];
            if (Array.isArray(payloadF)) listF = payloadF;
            else if (payloadF && Array.isArray(payloadF.facturas)) listF = payloadF.facturas;

            let listG = [];
            if (Array.isArray(payloadG)) listG = payloadG;
            else if (payloadG && Array.isArray(payloadG.gastos)) listG = payloadG.gastos;

            const facturas = listF.map(f => ({
                id: `F-${f.id_factura || f.id}`,
                fecha: new Date(f.fecha_emision || f.createdAt || Date.now()),
                concepto: `Venta - Factura #${f.id_factura || f.id}`,
                tipo: 'Ingreso',
                categoria: 'Ventas',
                monto: Number(f.monto_total || 0)
            }));

            const gastos = listG.map(g => ({
                id: `G-${g.id_gasto || g.id}`,
                fecha: new Date(g.fecha || g.createdAt || Date.now()),
                concepto: g.descripcion || 'Gasto Operativo',
                tipo: 'Egreso',
                categoria: g.categoria || 'Administración',
                monto: Number(g.monto || 0)
            }));

            setMovimientos([...facturas, ...gastos].sort((a, b) => b.fecha - a.fecha));

        } catch (err) {
            console.error("Error cargando datos:", err);
            mostrarFeedback(err.response?.data?.error || "Error de comunicación con el backend.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- FILTRADO ---
    const filtered = useMemo(() => {
        const start = new Date(filters.startDate); start.setHours(0,0,0,0);
        const end = new Date(filters.endDate); end.setHours(23,59,59,999);
        
        return movimientos.filter(m => {
            const dateMatch = m.fecha >= start && m.fecha <= end;
            const deptoMatch = filters.departamento === 'Todos' || m.categoria.toLowerCase().includes(filters.departamento.toLowerCase());
            const typeMatch = filters.activo === 'Todos' || (filters.activo === 'Ingresos' ? m.tipo === 'Ingreso' : m.tipo === 'Egreso');
            return dateMatch && deptoMatch && typeMatch;
        });
    }, [movimientos, filters]);

    const format = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

    // --- REPORTE PDF ---
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const generationDate = new Date().toLocaleString();
        const subIngresos = filtered.filter(m => m.tipo === 'Ingreso').reduce((a, b) => a + b.monto, 0);
        const subEgresos = filtered.filter(m => m.tipo === 'Egreso').reduce((a, b) => a + b.monto, 0);

        const html = `
            <html>
                <head>
                    <title>Reporte Financiero</title>
                    <style>
                        body { font-family: 'Helvetica', Arial, sans-serif; padding: 40px; color: #334155; }
                        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #F43F5E; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: 900; }
                        .logo span { color: #F43F5E; }
                        .info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 11px; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; font-size: 11px; }
                        th { background: #1e293b; color: white; padding: 10px; text-align: left; text-transform: uppercase; }
                        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
                        .total-box { float: right; width: 250px; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px; }
                        .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Taller<span>Pro</span></div>
                        <div style="text-align: right;"><h1>Resumen Financiero</h1></div>
                    </div>
                    <div class="info">
                        <div><b>Desde:</b> ${filters.startDate}</div>
                        <div><b>Hasta:</b> ${filters.endDate}</div>
                        <div><b>Emisión:</b> ${generationDate}</div>
                        <div><b>Registros:</b> ${filtered.length}</div>
                        <div><b>Categoría:</b> General</div>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Fecha</th><th>Concepto</th><th>Tipo</th><th>Monto</th></tr>
                        </thead>
                        <tbody>
                            ${filtered.map(m => `
                                <tr>
                                    <td>${m.fecha.toLocaleDateString()}</td>
                                    <td>${m.concepto}</td>
                                    <td>${m.tipo}</td>
                                    <td style="text-align: right; color: ${m.tipo === 'Ingreso' ? '#10b981' : '#f43f5e'}">
                                        ${format(m.monto)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total-box">
                        <div class="total-row"><span>Ingresos:</span> <span>${format(subIngresos)}</span></div>
                        <div class="total-row"><span>Egresos:</span> <span>${format(subEgresos)}</span></div>
                        <div class="total-row" style="font-size: 14px; border-top: 1px solid #cbd5e1; padding-top: 5px; margin-top: 5px;">
                            <span>NETO:</span> <span>${format(subIngresos - subEgresos)}</span>
                        </div>
                    </div>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
    };

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800 relative">
            
            {/* Toast Notificación */}
            {feedback && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-[200]`} style={feedbackStyles[feedback.tipo]}>
                    <p className="font-bold text-sm tracking-wide">{feedback.mensaje}</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black">Resumen <span className="text-[#F43F5E]">Financiero</span></h1>
                        <p className="text-slate-500 font-medium">Análisis de flujo de caja y resultados operativos.</p>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="cursor-pointer bg-[#F43F5E] hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span>📄</span> Generar Reporte PDF
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Desde</label>
                        <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Hasta</label>
                        <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Departamento</label>
                        <select value={filters.departamento} onChange={e => setFilters({...filters, departamento: e.target.value})} className="cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]">
                            <option value="Todos">Todos</option>
                            <option value="Ventas">Ventas</option>
                            <option value="Administración">Administración</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Tipo</label>
                        <select value={filters.activo} onChange={e => setFilters({...filters, activo: e.target.value})} className="cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]">
                            <option value="Todos">Todos</option>
                            <option value="Ingresos">Ingresos</option>
                            <option value="Egresos">Egresos</option>
                        </select>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-emerald-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 relative z-10">Ingresos Totales</p>
                        <h2 className="text-3xl font-black text-emerald-600 relative z-10">{format(balanceData.totalIngresos)}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-rose-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 relative z-10">Gastos Totales</p>
                        <h2 className="text-3xl font-black text-rose-600 relative z-10">{format(balanceData.totalGastos)}</h2>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[50px] -mr-10 -mt-10 opacity-30"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 relative z-10">Balance Neto</p>
                        <h2 className="text-3xl font-black relative z-10">{format(balanceData.balanceNeto)}</h2>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm">Historial de Transacciones</h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{filtered.length} Registros</span>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase">
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Concepto</th>
                                <th className="px-6 py-4 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan="3" className="py-20 text-center text-slate-400 font-bold animate-pulse">Sincronizando movimientos...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="3" className="py-20 text-center text-slate-400 font-bold italic">No hay registros</td></tr>
                            ) : (
                                filtered.map(m => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-500">{m.fecha.toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-black text-slate-800">{m.concepto}</td>
                                        <td className={`px-6 py-4 text-sm font-black text-right ${m.tipo === 'Ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {m.tipo === 'Ingreso' ? '+' : '-'}{format(m.monto)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default ResumenFinanciero;
