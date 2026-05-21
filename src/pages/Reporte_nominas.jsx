import React, { useState, useEffect } from 'react';
import api from '../services/axios.js';

export const ReporteNominas = () => {
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [feedback, setFeedback] = useState(null); // Feedback UI
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const mostrarFeedback = (mensaje, tipo = "ok") => {
    setFeedback({ visible: true, mensaje, tipo });
    setTimeout(() => setFeedback(null), 4500);
  };

  useEffect(() => {
    const fetchNominas = async () => {
      setLoading(true);
      try {
        // GET /api/empleados
        const response = await api.get('/empleados');
        const payload = response.data.data || response.data;
        
        // Extracción Inteligente
        let empleadosArray = [];
        if (Array.isArray(payload)) empleadosArray = payload;
        else if (payload && Array.isArray(payload.empleados)) empleadosArray = payload.empleados;
        
        const datosNomina = empleadosArray.map(emp => {
          const salarioBase = Number(emp.sueldo_base || 0);
          const realOS = emp._count?.ordenes || 0;
          
          const osFinalizadas = realOS > 0 ? realOS : 0; 
          const comisionProduccion = osFinalizadas * (Number(emp.monto_comision_fija) || 15);

          const bonoCalidad = osFinalizadas > 3 ? 50.00 : 0.00;
          const retenciones = salarioBase > 500 ? 45.00 : 0.00;
          
          const totalCalculado = salarioBase + comisionProduccion + bonoCalidad - retenciones;
          const totalPagado = (emp.nominas || [])
            .filter(n => n.tipo_pago === 'liquidacion')
            .reduce((acc, curr) => acc + Number(curr.monto_total || 0), 0);
            
          let neto = totalCalculado - totalPagado;
          if (neto < 0) neto = 0;
          
          return {
            id_empleado: emp.id_empleado,
            nombre: `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || 'Sin Nombre',
            cargo: emp.cargo || 'Sin Cargo',
            salarioBase,
            porcentajeComision: emp.aplica_comision ? 'Comisión Fija' : 'N/A',
            comisionProduccion,
            bonoCalidad, // Bono dinámico
            retenciones, // Retención dinámica
            osFinalizadas,
            neto
          };
        });
        setNominas(datosNomina);
      } catch (error) {
        console.error("Error cargando reporte nóminas", error);
        mostrarFeedback("Error cargando el reporte de nóminas.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchNominas();
  }, [startDate, endDate]);



  // Filtrado y Orden
  const filteredNominas = nominas.filter(n => {
    const term = searchTerm.toLowerCase();
    return (n.nombre?.toLowerCase().includes(term) || n.cargo?.toLowerCase().includes(term));
  }).sort((a, b) => {
    if (sortBy === 'nombre') return (a.nombre || '').localeCompare(b.nombre || '');
    if (sortBy === 'neto') {
      return (b.neto || 0) - (a.neto || 0);
    }
    if (sortBy === 'especialidad') return (a.cargo || '').localeCompare(b.cargo || '');
    return 0;
  });

  const totalAPagar = filteredNominas.reduce((acc, n) => acc + (n.neto || 0), 0);

  const feedbackStyles = {
    ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
    error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans relative">
      
      {/* Toast Notificación */}
      {feedback && (
          <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-[200]`} style={feedbackStyles[feedback.tipo]}>
              <p className="font-bold text-sm tracking-wide">{feedback.mensaje}</p>
          </div>
      )}



      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">Liquidación de <span className="text-[#F43F5E]">Nómina</span></h1>
                <p className="text-slate-500 font-medium">Control de pagos reales basados en sueldo base y comisiones por órdenes finalizadas.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-right min-w-[250px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Total Pasivo Laboral Real</span>
                <p className="text-4xl font-black text-blue-700">${totalAPagar.toFixed(2)}</p>
            </div>
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
                    type="search" 
                    placeholder="Escribe nombre o cargo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ordenar por</label>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E]"
                >
                    <option value="nombre">Nombre</option>
                    <option value="neto">Mayor Salario</option>
                    <option value="especialidad">Cargo</option>
                </select>
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-black text-slate-800 uppercase tracking-wider text-xs">Detalle de liquidación de haberes</h2>
                {loading && <span className="text-xs font-bold text-[#F43F5E] animate-pulse">Consultando base de datos...</span>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
                    <tr>
                    <th className="px-6 py-4">Empleado / Cargo</th>
                    <th className="px-6 py-4 text-center">Órdenes (OS)</th>
                    <th className="px-6 py-4 text-right">Sueldo Base</th>
                    <th className="px-6 py-4 text-right">Comisiones</th>
                    <th className="px-6 py-4 text-right text-red-500">Retenciones</th>
                    <th className="px-6 py-4 text-right font-black text-blue-800">Neto a Liquidar</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredNominas.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold italic">No se encontraron registros para este periodo.</td></tr>
                    ) : (
                        filteredNominas.map((n) => {
                            const neto = n.neto;
                            return (
                                <tr key={n.id_empleado} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-slate-800 group-hover:text-[#F43F5E] transition-colors">{n.nombre}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">{n.cargo}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg text-xs font-black">
                                            {n.osFinalizadas}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 font-bold">${n.salarioBase.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right text-emerald-600 font-black">+${n.comisionProduccion.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right text-rose-400">-${n.retenciones.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xl font-black text-slate-900">${neto.toFixed(2)}</span>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteNominas;
