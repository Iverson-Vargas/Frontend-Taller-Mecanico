import React, { useState, useEffect } from 'react';
import api from '../services/axios.js';
import * as XLSX from 'xlsx';

export const ReporteGanancia = () => {
  const [datos, setDatos] = useState({
    ingresos: { servicios: 0, repuestos: 0 },
    egresos: { comisiones: 0, gastosFijos: 0 }
  });
  
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
    fetchEstadoResultados();
  }, [startDate, endDate]);

  const fetchEstadoResultados = async () => {
    setIsLoading(true);
    try {
      // GET /api/reportes/estado-resultados
      const res = await api.get(`/reportes/estado-resultados?startDate=${startDate}&endDate=${endDate}`);
      
      // Extracción Inteligente
      const payload = res.data.data || res.data;
      
      // Eliminado el Fallback de Mocks. Asignamos la Data Real del backend
      setDatos({
        ingresos: {
          servicios: payload.ingresos || 0,
          repuestos: 0 // Nota: El backend actualmente agrupa todos los ingresos en facturación total
        },
        egresos: {
          comisiones: payload.egresos?.nomina || 0,
          gastosFijos: payload.egresos?.gastos_operativos || 0
        }
      });
    } catch(error) {
      console.error("Error al obtener estado de resultados:", error);
      mostrarFeedback(error.response?.data?.error || "Error al conectar con la base de datos", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const totalIngresos = Object.values(datos.ingresos).reduce((a, b) => a + Number(b), 0);
  const totalEgresos = Object.values(datos.egresos).reduce((a, b) => a + Number(b), 0);
  const utilidadNeta = totalIngresos - totalEgresos;
  
  const margenUtilidad = totalIngresos > 0 ? ((utilidadNeta / totalIngresos) * 100).toFixed(1) : 0;

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
      ["Descripcion de Operacion", "Categoria", "Monto Consolidado"],
      ["Servicios Mecánicos y Facturación General", "Ingreso", datos.ingresos.servicios],
      ["Comisiones de Personal Técnico (Nómina)", "Costo Variable", -datos.egresos.comisiones],
      ["Gastos de Operación y Compras", "Gasto / Compra", -datos.egresos.gastosFijos],
      ["", "", ""],
      ["Ingresos Brutos", "", totalIngresos],
      ["Total Egresos", "", totalEgresos],
      ["Utilidad Neta", "", utilidadNeta],
      ["Margen de Ganancia", "", `${margenUtilidad}%`]
    ];

    const ws = XLSX.utils.aoa_to_sheet(filas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estado de Resultados");
    XLSX.writeFile(wb, `Estado_Resultados_${startDate}_a_${endDate}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans relative">
      
      {/* Toast Notificación */}
      {feedback && (
          <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-[200]`} style={feedbackStyles[feedback.tipo]}>
              <p className="font-bold text-sm tracking-wide">{feedback.mensaje}</p>
          </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Estado de <span className="text-[#F43F5E]">Resultados</span></h1>
            <p className="text-slate-500 font-medium">Balance financiero real basado en facturación y egresos.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportarExcel} className="cursor-pointer bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              📄 Exportar Reporte
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Desde</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hasta</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Buscar operación</label>
                <input 
                    type="text" 
                    placeholder="Filtrar por descripción o categoría..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                />
            </div>
            {isLoading && <span className="text-xs font-bold text-[#F43F5E] animate-pulse">Sincronizando estado financiero...</span>}
        </div>
        
        {/* Resumen de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 relative z-10">Ingresos Brutos</p>
            <p className="text-3xl font-black text-slate-800 relative z-10">{formatter.format(totalIngresos)}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-t-4 border-t-rose-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 relative z-10">Total Egresos</p>
            <p className="text-3xl font-black text-rose-500 relative z-10">{formatter.format(totalEgresos)}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 relative z-10">Utilidad Neta</p>
            <p className="text-3xl font-black text-blue-600 relative z-10">{formatter.format(utilidadNeta)}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500 rounded-full blur-3xl -mr-10 -mt-10 opacity-30"></div>
            <p className="text-[10px] font-black text-slate-300 uppercase mb-1 relative z-10">Margen de Ganancia</p>
            <p className="text-3xl font-black text-rose-400 relative z-10">{margenUtilidad}%</p>
          </div>
        </div>

        {/* Detalle Detallado de Movimientos */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Desglose de Operaciones</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-black text-slate-400 uppercase">
                <th className="px-6 py-4">Descripción de Operación</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Monto Consolidado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { desc: "Servicios Mecánicos y Facturación General", cat: "Ingreso", monto: datos.ingresos.servicios, tipo: "ingreso" },
                { desc: "Comisiones de Personal Técnico (Nómina)", cat: "Costo Variable", monto: datos.egresos.comisiones, tipo: "egreso" },
                { desc: "Gastos de Operación y Compras", cat: "Gasto / Compra", monto: datos.egresos.gastosFijos, tipo: "egreso" }
              ].filter(item => 
                item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.cat.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700 font-bold text-sm">{item.desc}</td>
                  <td className="px-6 py-4">
                    <span className={`${item.tipo === 'ingreso' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} px-3 py-1 rounded-lg text-[10px] font-black uppercase`}>
                      {item.cat}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-black ${item.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {item.tipo === 'ingreso' ? '+' : '-'}{formatter.format(item.monto)}
                  </td>
                </tr>
              ))}
              {/* Mensaje si no hay resultados */}
              {[
                { desc: "Servicios Mecánicos y Facturación General", cat: "Ingreso", monto: datos.ingresos.servicios, tipo: "ingreso" },
                { desc: "Comisiones de Personal Técnico (Nómina)", cat: "Costo Variable", monto: datos.egresos.comisiones, tipo: "egreso" },
                { desc: "Gastos de Operación y Compras", cat: "Gasto / Compra", monto: datos.egresos.gastosFijos, tipo: "egreso" }
              ].filter(item => 
                item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.cat.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-400 font-bold italic">
                    No se encontraron operaciones que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReporteGanancia;
