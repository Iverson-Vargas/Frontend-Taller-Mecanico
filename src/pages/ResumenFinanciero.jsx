import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ResumenFinanciero = () => {
    // --- ESTADOS DE ACORDEONES ---
    const [openCategory, setOpenCategory] = useState('Gerencial');

    // --- ESTADO DE CONFIGURACIÓN DEL REPORTE ---
    const [selectedReport, setSelectedReport] = useState(null);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [filters, setFilters] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        departamento: 'Todos',
        activo: 'Todos'
    });

    // --- ESTADO DE DATOS GENERADOS ---
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- DEFINICIÓN DE REPORTES ---
    const reportsDef = {
        Operativos: [
            { id: 'vehiculos', name: 'Historial por Vehículos', desc: 'Listado de vehículos atendidos filtrados por tipo.', endpoint: '/vehiculos' },
            { id: 'operativos_gastos', name: 'Reportes Operativos (Gastos)', desc: 'Listado de gastos operativos detallados.', endpoint: '/gastos' }
        ],
        Supervision: [
            { id: 'cierre_caja', name: 'Cierre de Caja del Día', desc: 'Resumen de facturación diaria y pagos recibidos.', endpoint: '/facturas' }
        ],
        Gerencial: [
            { id: 'balance', name: 'Balance General', desc: 'Activos, pasivos y patrimonio del taller.', endpoint: '/reportes/balance' },
            { id: 'resultados', name: 'Estado de Resultados', desc: 'Ingresos vs Egresos y Utilidad Neta.', endpoint: '/reportes/estado-resultados' },
            { id: 'rentabilidad', name: 'Rentabilidad de Servicios', desc: 'Análisis de los servicios que generan más ingresos.', endpoint: '/reportes/rentabilidad-servicios' }
        ]
    };

    const handleSelectReport = (rep, cat) => {
        setSelectedReport({ ...rep, category: cat });
        setShowConfigModal(true);
    };

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setShowConfigModal(false);
        setIsLoading(true);
        setReportData(null);

        try {
            const res = await fetch(`${API_URL}${selectedReport.endpoint}`);
            if (!res.ok) throw new Error("Error en la petición a la API");
            
            let json = [];
            // Intentar parsear a json.
            try {
                json = await res.json();
            } catch (err) {
                throw new Error("Respuesta no es JSON válido");
            }
            
            // Transformar la data según el reporte para unificar el formato de tabla
            let parsedData = {
                title: selectedReport.name,
                category: selectedReport.category,
                filters: { ...filters },
                generationDate: new Date().toLocaleString(),
                columns: [],
                rows: [],
                totals: [],
                recordCount: 0
            };

            // LOGICA ESPECÍFICA PARA CADA REPORTE
            if (selectedReport.id === 'balance') {
                const payload = json.data || {};
                parsedData.columns = ['Concepto', 'Monto ($)'];
                parsedData.rows = [
                    ['Total Ingresos (Caja/Bancos)', payload.activos?.caja_bancos || 0],
                    ['Valor Inventario', payload.activos?.inventario || 0],
                    ['Honorarios por Pagar (Pasivos)', payload.pasivos?.honorarios_por_pagar || 0],
                    ['Total Gastos Registrados', payload.total_gastos || 0]
                ];
                parsedData.totals = [
                    ['Total Activos', payload.activos?.total || 0],
                    ['Total Pasivos', payload.pasivos?.total || 0],
                    ['Patrimonio Neto', payload.patrimonio || 0]
                ];
                parsedData.recordCount = 4;
            } 
            else if (selectedReport.id === 'resultados') {
                const payload = json.data || {};
                parsedData.columns = ['Categoría', 'Valor ($)'];
                parsedData.rows = [
                    ['Ingresos Totales', payload.ingresos || 0],
                    ['Nómina (Egresos)', payload.egresos?.nomina || 0],
                    ['Gastos Operativos', payload.egresos?.gastos_operativos || 0]
                ];
                parsedData.totals = [
                    ['Total Egresos', payload.egresos?.total || 0],
                    ['Utilidad Neta', payload.utilidad_neta || 0],
                    ['Margen de Ganancia (%)', (payload.margen || 0) + '%']
                ];
                parsedData.recordCount = 3;
            }
            else if (selectedReport.id === 'rentabilidad') {
                const servicios = json.data?.servicios || [];
                parsedData.columns = ['Servicio', 'Tipo', 'Veces Realizado', 'Ingreso Prom. ($)', 'Ingreso Total ($)'];
                parsedData.rows = servicios.map(s => [
                    s.nombre, s.tipo, s.veces_realizado, s.ingreso_promedio, s.ingreso_total
                ]);
                const totalIngresos = servicios.reduce((acc, s) => acc + s.ingreso_total, 0);
                parsedData.totals = [
                    ['Ingreso Total Consolidado', totalIngresos]
                ];
                parsedData.recordCount = servicios.length;
            }
            else if (selectedReport.id === 'cierre_caja') {
                const list = Array.isArray(json) ? json : (json.data || []);
                const dStart = new Date(filters.startDate); dStart.setHours(0,0,0,0);
                const dEnd = new Date(filters.endDate); dEnd.setHours(23,59,59,999);
                
                const filtradas = list.filter(f => {
                    const d = new Date(f.fecha_emision || f.createdAt);
                    return d >= dStart && d <= dEnd;
                });

                parsedData.columns = ['Nº Factura', 'Fecha', 'Cliente', 'Estado', 'Monto Total ($)'];
                parsedData.rows = filtradas.map(f => [
                    f.id_factura || f.id,
                    new Date(f.fecha_emision || f.createdAt).toLocaleDateString(),
                    f.orden_servicio?.vehiculo?.cliente?.nombre || 'General',
                    f.estado || 'Emitida',
                    Number(f.monto_total || f.monto || 0)
                ]);
                const sumTotal = filtradas.reduce((acc, f) => acc + Number(f.monto_total || f.monto || 0), 0);
                parsedData.totals = [
                    ['Caja del Periodo', sumTotal]
                ];
                parsedData.recordCount = filtradas.length;
            }
            else if (selectedReport.id === 'vehiculos') {
                const list = Array.isArray(json) ? json : (json.data || []);
                let filtradas = list;
                
                // Filtro "Tipo de carro" (Pesado/Liviano)
                if(filters.activo === 'Vehiculos_Livianos') {
                    filtradas = filtradas.filter(v => v.tipo === 'Liviano' || !v.tipo);
                } else if(filters.activo === 'Vehiculos_Pesados') {
                    filtradas = filtradas.filter(v => v.tipo === 'Pesado');
                }

                parsedData.columns = ['Placa', 'Marca', 'Modelo', 'Año', 'Dueño'];
                parsedData.rows = filtradas.map(v => [
                    v.placa || 'N/A', v.marca || 'N/A', v.modelo || 'N/A', v.anio || 'N/A', v.cliente?.nombre || 'N/A'
                ]);
                parsedData.totals = [
                    ['Total Vehículos Atendidos', filtradas.length]
                ];
                parsedData.recordCount = filtradas.length;
            }
            else if (selectedReport.id === 'operativos_gastos') {
                const list = Array.isArray(json) ? json : (json.data || []);
                const dStart = new Date(filters.startDate); dStart.setHours(0,0,0,0);
                const dEnd = new Date(filters.endDate); dEnd.setHours(23,59,59,999);
                
                const filtradas = list.filter(g => {
                    const d = new Date(g.fecha || g.createdAt);
                    return d >= dStart && d <= dEnd;
                });

                parsedData.columns = ['ID Gasto', 'Fecha', 'Categoría', 'Descripción', 'Monto ($)'];
                parsedData.rows = filtradas.map(g => [
                    g.id_gasto || g.id, new Date(g.fecha || g.createdAt).toLocaleDateString(), g.categoria || 'Gasto', g.descripcion || 'N/A', Number(g.monto || 0)
                ]);
                const sum = filtradas.reduce((acc, g) => acc + Number(g.monto||0), 0);
                parsedData.totals = [
                    ['Suma Gastos Operativos', sum]
                ];
                parsedData.recordCount = filtradas.length;
            }

            setReportData(parsedData);
        } catch (error) {
            console.error("Error generando reporte:", error);
            alert("❌ Error al consultar la API: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (val) => {
        if(typeof val === 'number') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
        }
        return val;
    };

    // --- EXPORTAR PDF ---
    const handleExportPDF = () => {
        if(!reportData) return;
        const printWindow = window.open('', '_blank');
        
        let rowsHtml = '';
        reportData.rows.forEach(row => {
            rowsHtml += `<tr>${row.map((cell, i) => {
                const isMoney = typeof cell === 'number' && reportData.columns[i].includes('($)');
                return `<td>${isMoney ? formatCurrency(cell) : cell}</td>`;
            }).join('')}</tr>`;
        });

        let totalsHtml = '';
        reportData.totals.forEach(t => {
            totalsHtml += `<div class="total-line"><span>${t[0]}:</span> <strong>${typeof t[1] === 'number' ? formatCurrency(t[1]) : t[1]}</strong></div>`;
        });

        const html = `
            <html>
                <head>
                    <title>${reportData.title} - Taller Mecánico</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; margin: 0; }
                        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #F43F5E; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: 900; color: #0f172a; }
                        .logo span { color: #F43F5E; }
                        .report-title { text-align: right; }
                        .report-title h1 { margin: 0 0 5px 0; font-size: 28px; color: #1e293b; text-transform: uppercase; }
                        .report-title p { margin: 0; color: #64748b; font-size: 14px; }
                        .info-grid { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; }
                        .info-item { flex: 1; min-width: 150px; }
                        .info-item label { display: block; font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-bottom: 4px; }
                        .info-item span { font-size: 14px; font-weight: 600; color: #334155; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th { background: #1e293b; color: white; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; }
                        td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                        tr:nth-child(even) { background-color: #f8fafc; }
                        .summary-box { display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 5px solid #F43F5E; }
                        .records { font-size: 14px; color: #64748b; font-weight: bold; }
                        .totals { text-align: right; }
                        .total-line { margin-bottom: 5px; font-size: 16px; }
                        .total-line strong { font-size: 20px; color: #0f172a; }
                        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                            .page-number:after { content: counter(page); }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Taller<span>Pro</span></div>
                        <div class="report-title">
                            <h1>${reportData.title}</h1>
                            <p>Módulo: ${reportData.category}</p>
                        </div>
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Periodo (Desde - Hasta)</label>
                            <span>${reportData.filters.startDate} a ${reportData.filters.endDate}</span>
                        </div>
                        <div class="info-item">
                            <label>Departamento / Filtro</label>
                            <span>${reportData.filters.departamento}</span>
                        </div>
                        <div class="info-item">
                            <label>Activo(s)</label>
                            <span>${reportData.filters.activo}</span>
                        </div>
                        <div class="info-item">
                            <label>Fecha de Emisión</label>
                            <span>${reportData.generationDate}</span>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                ${reportData.columns.map(c => `<th>${c}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>

                    <div class="summary-box">
                        <div class="records">Cantidad de registros buscados: ${reportData.recordCount}</div>
                        <div class="totals">
                            ${totalsHtml}
                        </div>
                    </div>

                    <div class="footer">
                        Este documento es un reporte generado por el sistema. Todos los derechos reservados.<br/>
                        Página <span class="page-number"></span>
                    </div>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 200);
    };

    // --- EXPORTAR EXCEL (CSV) ---
    const handleExportExcel = () => {
        if(!reportData) return;
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // \uFEFF para que Excel lea UTF-8
        
        // Encabezados del reporte
        csvContent += "Taller Mecanico - Sistema de Gestion\n";
        csvContent += `Reporte: ${reportData.title}\n`;
        csvContent += `Categoria: ${reportData.category}\n`;
        csvContent += `Periodo: ${reportData.filters.startDate} a ${reportData.filters.endDate}\n`;
        csvContent += `Filtro Departamento: ${reportData.filters.departamento}\n`;
        csvContent += `Fecha Emision: ${reportData.generationDate}\n\n`;

        // Columnas
        csvContent += reportData.columns.join(";") + "\n";

        // Filas
        reportData.rows.forEach(row => {
            let rowStr = row.map(cell => {
                let cellStr = cell !== null && cell !== undefined ? cell.toString() : '';
                return `"${cellStr.replace(/"/g, '""')}"`;
            }).join(";");
            csvContent += rowStr + "\n";
        });

        // Totales
        csvContent += "\nTOTALES\n";
        reportData.totals.forEach(t => {
            csvContent += `"${t[0]}";"${t[1]}"\n`;
        });
        csvContent += `\nCantidad Registros: ${reportData.recordCount}\n`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Reporte_${reportData.title.replace(/ /g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- COMPONENTE ACORDEON ---
    const ReportCategory = ({ title, icon, children, isOpen, onClick }) => (
        <div className="mb-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button 
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors"
                onClick={onClick}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <h2 className="text-lg font-black text-slate-800">{title}</h2>
                </div>
                <svg className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center text-sm text-slate-500 mb-2 font-semibold">
                            <Link to="/panel/Reportes" className="hover:text-[#F43F5E] transition-colors">Inicio</Link>
                            <span className="mx-2">/</span>
                            <span className="text-slate-800">Generador de Reportes</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Central de <span className="text-[#F43F5E]">Reportes Avanzados</span>
                        </h1>
                        <p className="text-slate-500 mt-1">Generación dinámica, filtros y exportación a PDF y Excel.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* COLUMNA IZQUIERDA: ACORDEONES */}
                    <div className="lg:col-span-1">
                        <ReportCategory 
                            title="Reportes Operativos" 
                            icon="🔧" 
                            isOpen={openCategory === 'Operativos'}
                            onClick={() => setOpenCategory(openCategory === 'Operativos' ? '' : 'Operativos')}
                        >
                            <div className="space-y-3">
                                {reportsDef.Operativos.map(rep => (
                                    <button 
                                        key={rep.id}
                                        onClick={() => handleSelectReport(rep, 'Operativos')}
                                        className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-[#F43F5E] hover:shadow-sm transition-all group"
                                    >
                                        <h4 className="font-bold text-slate-700 group-hover:text-[#F43F5E]">{rep.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </ReportCategory>

                        <ReportCategory 
                            title="Reportes de Supervisión" 
                            icon="👁️" 
                            isOpen={openCategory === 'Supervision'}
                            onClick={() => setOpenCategory(openCategory === 'Supervision' ? '' : 'Supervision')}
                        >
                            <div className="space-y-3">
                                {reportsDef.Supervision.map(rep => (
                                    <button 
                                        key={rep.id}
                                        onClick={() => handleSelectReport(rep, 'Supervision')}
                                        className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-[#F43F5E] hover:shadow-sm transition-all group"
                                    >
                                        <h4 className="font-bold text-slate-700 group-hover:text-[#F43F5E]">{rep.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </ReportCategory>

                        <ReportCategory 
                            title="Reportes Gerenciales" 
                            icon="📈" 
                            isOpen={openCategory === 'Gerencial'}
                            onClick={() => setOpenCategory(openCategory === 'Gerencial' ? '' : 'Gerencial')}
                        >
                            <div className="space-y-3">
                                {reportsDef.Gerencial.map(rep => (
                                    <button 
                                        key={rep.id}
                                        onClick={() => handleSelectReport(rep, 'Gerencial')}
                                        className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-[#F43F5E] hover:shadow-sm transition-all group"
                                    >
                                        <h4 className="font-bold text-slate-700 group-hover:text-[#F43F5E]">{rep.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </ReportCategory>
                    </div>

                    {/* COLUMNA DERECHA: VISTA PREVIA DEL REPORTE */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F43F5E] mb-4"></div>
                                <p className="text-slate-500 font-bold animate-pulse">Consultando datos a la API...</p>
                            </div>
                        ) : reportData ? (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
                                {/* BARRA DE ACCIONES */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-slate-100 gap-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">{reportData.title}</h2>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{reportData.category}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleExportExcel} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors flex items-center shadow-sm">
                                            📊 Exportar Excel
                                        </button>
                                        <button onClick={handleExportPDF} className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center shadow-sm">
                                            📄 Generar PDF
                                        </button>
                                    </div>
                                </div>

                                {/* METADATOS DEL REPORTE */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Periodo</p>
                                        <p className="text-xs font-black text-slate-700">{reportData.filters.startDate} a {reportData.filters.endDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Filtro / Depto</p>
                                        <p className="text-xs font-black text-slate-700">{reportData.filters.departamento}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Registros Hallados</p>
                                        <p className="text-xs font-black text-slate-700">{reportData.recordCount} Items</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Emisión</p>
                                        <p className="text-xs font-black text-slate-700">{reportData.generationDate}</p>
                                    </div>
                                </div>

                                {/* TABLA DE DATOS (PREVIEW) */}
                                <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-100 border-b border-slate-200">
                                            <tr>
                                                {reportData.columns.map((c, i) => (
                                                    <th key={i} className="px-4 py-3 text-xs font-black text-slate-600 uppercase">{c}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {reportData.rows.length === 0 ? (
                                                <tr>
                                                    <td colSpan={reportData.columns.length} className="px-4 py-8 text-center text-slate-500 font-medium">
                                                        No hay datos para los filtros seleccionados.
                                                    </td>
                                                </tr>
                                            ) : (
                                                reportData.rows.slice(0, 10).map((row, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                        {row.map((cell, j) => {
                                                            const isMoney = typeof cell === 'number' && reportData.columns[j].includes('($)');
                                                            return (
                                                                <td key={j} className="px-4 py-3 text-sm text-slate-700 font-medium">
                                                                    {isMoney ? formatCurrency(cell) : cell}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    {reportData.rows.length > 10 && (
                                        <div className="bg-slate-50 p-3 text-center text-xs font-bold text-slate-500 border-t border-slate-200">
                                            Mostrando 10 de {reportData.rows.length} registros en la vista previa. Exporte para ver todos.
                                        </div>
                                    )}
                                </div>

                                {/* TOTALES */}
                                <div className="flex justify-end">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-w-[300px]">
                                        <h4 className="text-xs font-black text-slate-400 uppercase mb-4 border-b border-slate-200 pb-2">Subtotales y Totales</h4>
                                        <div className="space-y-3">
                                            {reportData.totals.map((t, i) => (
                                                <div key={i} className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-slate-600">{t[0]}</span>
                                                    <span className="text-xl font-black text-slate-800">{typeof t[1] === 'number' ? formatCurrency(t[1]) : t[1]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[400px] text-center">
                                <span className="text-6xl mb-4 opacity-50">📊</span>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Ningún reporte seleccionado</h3>
                                <p className="text-slate-500 max-w-sm">Selecciona un reporte del menú lateral para configurar los parámetros y visualizar los datos generados por el sistema.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE CONFIGURACIÓN DEL REPORTE */}
            {showConfigModal && selectedReport && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">
                        <div className="p-6 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-xl font-black text-slate-800">Generar: {selectedReport.name}</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase mt-1">{selectedReport.category}</p>
                        </div>
                        <form onSubmit={handleGenerateReport} className="p-6 space-y-5">
                            <p className="text-sm text-slate-600 mb-4">{selectedReport.desc}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Fecha Desde</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                                        value={filters.startDate}
                                        onChange={e => setFilters({...filters, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Fecha Hasta</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                                        value={filters.endDate}
                                        onChange={e => setFilters({...filters, endDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Filtro / Departamento</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                                    value={filters.departamento}
                                    onChange={e => setFilters({...filters, departamento: e.target.value})}
                                >
                                    <option value="Todos">Todos los departamentos/tipos</option>
                                    <option value="Taller">Taller Operativo</option>
                                    <option value="Administracion">Administración</option>
                                    <option value="Ventas">Ventas/Repuestos</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Filtro de Activos Específicos</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                                    value={filters.activo}
                                    onChange={e => setFilters({...filters, activo: e.target.value})}
                                >
                                    <option value="Todos">Aplicar a todos</option>
                                    <option value="Vehiculos_Livianos">Solo Vehículos Livianos</option>
                                    <option value="Vehiculos_Pesados">Solo Vehículos Pesados</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowConfigModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all">
                                    CANCELAR
                                </button>
                                <button type="submit" className="flex-1 bg-slate-800 text-white font-black py-3.5 rounded-xl shadow-lg hover:bg-slate-900 transition-all">
                                    EJECUTAR REPORTE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumenFinanciero;
