import React, { useState } from 'react';

export const ReporteNominas = () => {
  const [nominas] = useState([
    { 
      id: 1, 
      nombre: 'Jose Pernalete', 
      cargo: 'Mecánico Senior',
      salarioBase: 400.00,
      porcentajeComision: 0.30, 
      comisionProduccion: 150.00, 
      bonoCalidad: 50.00,        
      retenciones: 45.00,        
      osFinalizadas: 8 // Dato de productividad
    },
    { 
      id: 2, 
      nombre: 'Juan Rodrigues', 
      cargo: 'Especialista en Frenos',
      salarioBase: 350.00,
      porcentajeComision: 0.25, 
      comisionProduccion: 105.00, 
      bonoCalidad: 0.00,
      retenciones: 38.00,
      osFinalizadas: 5 // Dato de productividad
    },
  ]);

  const totalAPagar = nominas.reduce((acc, n) => 
    acc + (n.salarioBase + n.comisionProduccion + n.bonoCalidad - n.retenciones), 0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
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

      {/* Tabla Pro de Nómina con columna de OS independiente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
            {nominas.map((n) => {
              const neto = n.salarioBase + n.comisionProduccion + n.bonoCalidad - n.retenciones;
              return (
                <tr key={n.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{n.nombre}</div>
                    <div className="text-xs text-blue-500 font-bold uppercase">{n.cargo}</div>
                  </td>
                  {/* Columna Independiente de OS */}
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold leading-none text-gray-800 bg-gray-200 rounded-lg shadow-sm">
                      {n.osFinalizadas}
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Finalizadas</p>
                  </td>
                  <td className="p-4 text-right text-gray-600 font-medium">${n.salarioBase.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-black">
                      {(n.porcentajeComision * 100)}%
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
                      onClick={() => alert(`Liquidando nómina de ${n.nombre}...`)}
                      className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      Liquidar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};