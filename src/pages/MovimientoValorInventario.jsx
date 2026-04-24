import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const MovimientoValorInventario = () => {
    const navigate = useNavigate();
    const [inventario, setInventario] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    
    // KPIs calculados
    const [valorTotal, setValorTotal] = useState(0);
    const [articulosStock, setArticulosStock] = useState(0);

    useEffect(() => {
        fetchInventario();
    }, []);

    const fetchInventario = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/inventario`);
            if (res.ok) {
                const result = await res.json();
                const list = result.data || [];
                
                // Fallback si no hay datos en la BD
                const finalData = list.length > 0 ? list : [
                    { id_repuesto: 101, nombre_repuesto: "Aceite 20W50 Mineral", stock_actual: 12, precio_venta_sugerido: 15.5, proveedor: "Motul" },
                    { id_repuesto: 102, nombre_repuesto: "Filtro de Aceite (Generico)", stock_actual: 3, precio_venta_sugerido: 8.0, proveedor: "Millard" },
                    { id_repuesto: 103, nombre_repuesto: "Pastillas de Freno Del.", stock_actual: 25, precio_venta_sugerido: 45.0, proveedor: "Brembo" }
                ];

                setInventario(finalData);
                
                let totalValor = 0;
                let totalArticulos = 0;
                finalData.forEach(item => {
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
        } finally {
            setLoading(false);
        }
    };

    const filtrados = inventario.filter(item => 
        item.nombre_repuesto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.id_repuesto).includes(searchTerm)
    );

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-6 font-sans">
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
                    <button onClick={() => window.print()} className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        📄 Exportar Reporte
                    </button>
                </header>

                {/* Filtros */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex items-center gap-6">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Buscar en almacén</label>
                        <input 
                            type="text" 
                            placeholder="Nombre del repuesto o código ID..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#F43F5E] transition-all"
                        />
                    </div>
                    {loading && <span className="text-xs font-black text-[#F43F5E] animate-pulse">Sincronizando stock...</span>}
                </div>

                {/* KPI DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-l-8 border-l-blue-500">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valor Capitalizado</h3>
                        <p className="text-5xl font-black text-slate-800">{formatter.format(valorTotal)}</p>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Inversión total basada en precio de venta sugerido.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-l-8 border-l-emerald-500">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unidades Totales</h3>
                        <p className="text-5xl font-black text-slate-800">{articulosStock} <span className="text-xl text-slate-400 font-bold">Pzs</span></p>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Suma total de artículos físicos disponibles.</p>
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
                                <p className="text-slate-400 font-bold italic">No se encontraron artículos con el criterio seleccionado</p>
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
                                                    #{item.id_repuesto}
                                                </td>
                                                <td className="px-6 py-4 font-black text-slate-800 group-hover:text-[#F43F5E] transition-colors">
                                                    {item.nombre_repuesto}
                                                    {item.proveedor && <span className="block text-[10px] text-slate-400 uppercase font-bold">{item.proveedor}</span>}
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
