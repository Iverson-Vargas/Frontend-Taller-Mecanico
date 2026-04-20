import React, { useState } from 'react';

export const ReporteGanancia = () => {
  // 1. Centralizamos los datos para que el componente sea dinámico
  const [datos] = useState({
    ingresos: {
      servicios: 3000.00,
      repuestos: 1500.00
    },
    egresos: {
      comisiones: 900.00,
      gastosFijos: 1200.00
    }
  });

  // 2. Lógica de cálculo (Ingeniería de datos)
  const totalIngresos = Object.values(datos.ingresos).reduce((a, b) => a + b, 0);
  const totalEgresos = Object.values(datos.egresos).reduce((a, b) => a + b, 0);
  const utilidadNeta = totalIngresos - totalEgresos;
  
  // Cálculo de margen de utilidad (KPI fundamental para el Admin)
  const margenUtilidad = ((utilidadNeta / totalIngresos) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Encabezado con Filtros Simulados */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Estado de Resultados</h1>
          <p className="text-gray-500">Balance financiero del periodo actual</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50">Exportar PDF</button>
          <select className="bg-white border px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
            <option>Marzo 2026</option>
            <option>Febrero 2026</option>
          </select>
        </div>
      </div>
      
      {/* Resumen de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Ingresos Brutos</p>
          <p className="text-3xl font-black text-gray-800">${totalIngresos.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Egresos</p>
          <p className="text-3xl font-black text-red-500">${totalEgresos.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Utilidad Neta</p>
          <p className="text-3xl font-black text-blue-600">${utilidadNeta.toLocaleString()}</p>
        </div>
        <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-xs font-bold text-blue-100 uppercase mb-1">Margen de Ganancia</p>
          <p className="text-3xl font-black">{margenUtilidad}%</p>
        </div>
      </div>

      {/* Detalle Detallado de Movimientos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-gray-800">Desglose de Operaciones</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Descripción</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {/* Sección de Ingresos */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-700 font-medium">Servicios Mecánicos Realizados</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Ingreso</span></td>
              <td className="px-6 py-4 text-right font-mono font-bold text-green-600">+${datos.ingresos.servicios.toFixed(2)}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-700 font-medium">Venta de Repuestos e Insumos</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Ingreso</span></td>
              <td className="px-6 py-4 text-right font-mono font-bold text-green-600">+${datos.ingresos.repuestos.toFixed(2)}</td>
            </tr>
            {/* Sección de Egresos */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-700 font-medium">Comisiones de Mecánicos (Pasivo)</td>
              <td className="px-6 py-4"><span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Costo</span></td>
              <td className="px-6 py-4 text-right font-mono font-bold text-red-500">-${datos.egresos.comisiones.toFixed(2)}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-700 font-medium">Gastos de Operación (Luz, Agua, Alquiler)</td>
              <td className="px-6 py-4"><span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Gasto</span></td>
              <td className="px-6 py-4 text-right font-mono font-bold text-red-500">-${datos.egresos.gastosFijos.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteGanancia;