import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const MovimientoValorInventario = () => {
    const navigate = useNavigate();
    const [inventario, setInventario] = useState([]);
    
    // KPIs calculados
    const [valorTotal, setValorTotal] = useState(0);
    const [articulosStock, setArticulosStock] = useState(0);

    useEffect(() => {
        fetchInventario();
    }, []);

    const fetchInventario = async () => {
        try {
            const res = await fetch(`${API_URL}/inventario`);
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.data || []);
                setInventario(list);
                
                // Calcular KPIs
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
            }
        } catch (error) {
            console.error("Error al obtener inventario:", error);
        }
    };

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* ENCABEZADO */}
                <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <button 
                            onClick={() => navigate('/panel/Reportes')} 
                            className="mb-4 cursor-pointer text-slate-500 hover:text-[#F43F5E] text-sm font-bold flex items-center gap-1 transition-colors"
                        >
                            ← Volver a Reportes
                        </button>
                        <h1 className="text-3xl text-slate-800 font-extrabold m-0">
                            Valorización del <span className="text-[#F43F5E]">Inventario Real</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1.5 font-medium">
                            Análisis detallado de existencias y valorización actual del stock directamente de la base de datos.
                        </p>
                    </div>
                    <div className="text-right flex gap-2">
                        <button onClick={() => window.print()} className="cursor-pointer bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-bold border border-slate-200 shadow-sm hover:bg-slate-50">
                            Exportar PDF
                        </button>
                    </div>
                </header>

                {/* KPI DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500 hover:shadow-md transition-shadow">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Total Inventario</h3>
                        <p className="text-4xl font-extrabold text-slate-800">{formatter.format(valorTotal)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total de Artículos en Stock</h3>
                        <p className="text-4xl font-extrabold text-slate-800">{articulosStock} <span className="text-sm text-slate-500 font-medium">uds</span></p>
                    </div>
                </div>

                {/* TABLA DE EXISTENCIAS */}
                <div className="bg-white p-0 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg text-slate-800 m-0 border-l-4 border-emerald-500 pl-3 font-bold">
                            Detalle de Stock Actual
                        </h2>
                    </div>
                    <div className="overflow-x-auto p-5 pt-0">
                        {inventario.length === 0 ? (
                            <p className="text-slate-500 text-center py-6 font-medium">No hay repuestos registrados en el inventario.</p>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Código / Proveedor</th>
                                        <th className="text-left p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Repuesto</th>
                                        <th className="text-center p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Stock</th>
                                        <th className="text-right p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Precio Sugerido</th>
                                        <th className="text-right p-4 bg-white text-slate-500 text-xs uppercase border-b border-slate-200 font-extrabold tracking-wider">Valor Acumulado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {inventario.map(item => {
                                        const stock = Number(item.stock_actual || 0);
                                        const precio = Number(item.precio_venta_sugerido || item.precio_compra || 0);
                                        const total = stock * precio;
                                        
                                        return (
                                            <tr key={item.id_repuesto} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 text-sm text-slate-500 font-mono">ID: {item.id_repuesto} {item.proveedor ? `- ${item.proveedor}` : ''}</td>
                                                <td className="p-4 text-sm text-slate-800 font-bold">{item.nombre_repuesto}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${stock < (item.stock_minimo || 5) ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                        {stock} uds
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-right text-slate-600 font-medium">{formatter.format(precio)}</td>
                                                <td className="p-4 text-sm font-bold text-right text-slate-800">{formatter.format(total)}</td>
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
