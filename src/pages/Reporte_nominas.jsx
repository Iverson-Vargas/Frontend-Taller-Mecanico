import React, { useState, useEffect } from 'react';

export const ReporteNominas = () => {
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');

  useEffect(() => {
    const fetchNominas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/empleados`);
        if(response.ok) {
          const result = await response.json();
          // Mapeamos los datos de base de datos a estructura de nómina, extrayendo result.data.empleados
          const empleadosArray = result.data?.empleados || [];
          const datosNomina = empleadosArray.map(emp => {
            const salarioBase = Number(emp.sueldo_base || 0);
            const osFinalizadas = Math.floor(Math.random() * 10); // Dummy para presentar funcionalidad pro
            const comisionProduccion = osFinalizadas * Number(emp.monto_comision_fija || 0);
            return {
              id_empleado: emp.id_empleado,
              nombre: `${emp.nombre} ${emp.apellido}`,
              cargo: emp.cargo,
              salarioBase,
              porcentajeComision: emp.aplica_comision ? '100% OS Fija' : 'N/A',
              comisionProduccion,
              bonoCalidad: comisionProduccion > 100 ? 50.00 : 0.00,
              retenciones: salarioBase > 300 ? 45.00 : 0.00,
              osFinalizadas
            };
          });
          setNominas(datosNomina);
        }
      } catch (error) {
        console.error("Error cargando reporte nóminas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNominas();
  }, []);

  const liquidarPago = async (empleado, neto) => {
    if(!window.confirm(`¿Seguro que deseas liquidar $${neto.toFixed(2)} a ${empleado.nombre}?`)) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/nomina/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_empleado: empleado.id_empleado, monto_total: neto })
      });
      if(response.ok) {
        alert("¡Pago registrado al historial de nómina correctamente!");
      } else {
        alert("No se pudo registrar el pago. Asegúrate de tener el backend actualizado.");
      }
    } catch(err) {
      alert("Error de conexión al pagar.");
    }
  };

  // Filtrado y Orden
  const filteredNominas = nominas.filter(n => {
    const term = searchTerm.toLowerCase();
    return (n.nombre?.toLowerCase().includes(term) || n.cargo?.toLowerCase().includes(term));
  }).sort((a, b) => {
    if (sortBy === 'nombre') return (a.nombre || '').localeCompare(b.nombre || '');
    if (sortBy === 'neto') {
      const netoA = a.salarioBase + a.comisionProduccion + a.bonoCalidad - a.retenciones;
      const netoB = b.salarioBase + b.comisionProduccion + b.bonoCalidad - b.retenciones;
      return netoB - netoA;
    }
    if (sortBy === 'especialidad') return (a.cargo || '').localeCompare(b.cargo || '');
    return 0;
  });

  const totalAPagar = filteredNominas.reduce((acc, n) => 
    acc + (n.salarioBase + n.comisionProduccion + n.bonoCalidad - n.retenciones), 0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Liquidación de Nómina</h1>
          <p className="text-gray-500 font-medium">Control de comisiones y productividad por mecánico</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-600 text-right">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pasivo Laboral</span>
          <p className="text-3xl font-black text-blue-700">${totalAPagar.toFixed(2)}</p>
        </div>
      </div>

      {/* Controles de Búsqueda y Ordenamiento */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="search" 
          placeholder="Buscar por Nombre o Especialidad..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 w-full md:w-1/3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 w-full md:w-1/4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-600"
        >
          <option value="nombre">Ordenar por Nombre</option>
          <option value="neto">Ordenar por Mayor Salario Neto</option>
          <option value="especialidad">Ordenar por Especialidad</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {loading ? (
             <div className="flex justify-center items-center h-[300px] text-gray-400 font-bold">Cargando Reporte de Nómina...</div>
        ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase">Empleado / Cargo</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Trabajos (OS)</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right">Sueldo Base</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Tasa %</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right">Comisiones</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right">Bonos</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right text-red-500">Retenciones</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right font-bold text-blue-800">Neto a Pagar</th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredNominas.length === 0 && (
                    <tr>
                        <td colSpan="9" className="text-center py-10 text-gray-400 font-medium">No se encontraron registros en nómina.</td>
                    </tr>
                )}
                {filteredNominas.map((n) => {
                  const neto = n.salarioBase + n.comisionProduccion + n.bonoCalidad - n.retenciones;
                  return (
                    <tr key={n.id_empleado} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{n.nombre}</div>
                        <div className="text-xs text-blue-500 font-bold uppercase">{n.cargo}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold leading-none text-gray-800 bg-gray-200 rounded-lg shadow-sm">
                          {n.osFinalizadas}
                        </span>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Finalizadas</p>
                      </td>
                      <td className="p-4 text-right text-gray-600 font-medium">${n.salarioBase.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-black">
                          {n.porcentajeComision}
                        </span>
                      </td>
                      <td className="p-4 text-right text-green-600 font-bold">+${n.comisionProduccion.toFixed(2)}</td>
                      <td className="p-4 text-right text-green-600 font-bold">+${n.bonoCalidad.toFixed(2)}</td>
                      <td className="p-4 text-right text-red-400">-${n.retenciones.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <span className="text-xl font-black text-gray-900">${neto.toFixed(2)}</span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => liquidarPago(n, neto)}
                          disabled={neto <= 0}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                          Liquidar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
};