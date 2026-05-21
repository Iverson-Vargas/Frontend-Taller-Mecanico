import React, { useState, useRef } from 'react';

export const Egresos_Gastos = () => {
    const [exchangeRate, setExchangeRate] = useState(36.50);
    const [cargandoTasa, setCargandoTasa] = useState(false);
    const [isBs, setIsBs] = useState(false);

    useEffect(() => {
        const fetchTasaBCV = async () => {
            setCargandoTasa(true);
            try {
                const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://api-bcv-pi.vercel.app/api/tasa/usd')}`);
                const data = await res.json();
                if (data && data.valor && data.valor.valor_num) {
                    setExchangeRate(parseFloat(Number(data.valor.valor_num).toFixed(2)));
                }
            } catch (error) {
                console.error('Error al obtener la tasa BCV:', error);
            } finally {
                setCargandoTasa(false);
            }
        };
        fetchTasaBCV();
    }, []);
    
    // Referencia oculta para el input de archivos
    const fileInputRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);

    const [cuentas, setCuentas] = useState([
        { id: 1, categoria: 'Proveedor', desc: 'Filtros S.A. (Aceite)', montoUSD: 150.00, estado: 'Por Pagar', soporte: null },
        { id: 2, categoria: 'Gasto', desc: 'Pago Luz CORPOELEC', montoUSD: 25.00, estado: 'Pagado', soporte: 'recibo_luz.jpg' }
    ]);

    const [nuevoRegistro, setNuevoRegistro] = useState({
        categoria: 'Proveedor',
        desc: '',
        montoUSD: '',
        estado: 'Por Pagar'
    });

    const activarSoporte = (id) => {
        setSelectedId(id);
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && selectedId) {
            const nuevasCuentas = cuentas.map(c => {
                if (c.id === selectedId) {
                    return { 
                        ...c, 
                        soporte: file.name, 
                        estado: 'Pagado'
                    };
                }
                return c;
            });
            setCuentas(nuevasCuentas);
            alert(`Soporte "${file.name}" vinculado con éxito.`);
        }
    };

    const handleAgregar = (e) => {
        e.preventDefault();
        const nuevo = {
            ...nuevoRegistro,
            id: Date.now(),
            montoUSD: parseFloat(nuevoRegistro.montoUSD),
            soporte: null
        };
        setCuentas([nuevo, ...cuentas]);
        setNuevoRegistro({ categoria: 'Proveedor', desc: '', montoUSD: '', estado: 'Por Pagar' });
    };

    const renderMontoPrioritario = (usd) => {
        if (isBs) return (usd * exchangeRate).toLocaleString('es-VE') + ' Bs';
        return '$' + usd.toFixed(2);
    };

    const renderMontoSecundario = (usd) => {
        if (isBs) return '$' + usd.toFixed(2);
        return (usd * exchangeRate).toLocaleString('es-VE') + ' Bs';
    };

    const proveedores = cuentas.filter(c => c.categoria === 'Proveedor');
    const gastosOperativos = cuentas.filter(c => c.categoria === 'Gasto');

    return (
        <div className="bg-slate-100 min-h-screen py-10 px-5 font-sans">
            <div className="max-w-6xl mx-auto p-8 bg-white rounded-[24px] border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                
                {/* Input de archivo oculto */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                />

                <header className="mb-6">
                    <h1 className="text-3xl text-slate-800 font-extrabold m-0">
                        Gestión de <span className="text-[#F43F5E]">Egresos</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">
                        Panel administrativo de proveedores y servicios operativos.
                    </p>
                </header>

                <div className="flex justify-end items-center gap-4 mb-5">
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 font-bold flex items-center gap-2">
                        Tasa BCV: <span className="text-[#F43F5E]">{exchangeRate}</span>
                        {cargandoTasa && (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#F43F5E] ml-1"></div>
                        )}
                    </div>
                    <button 
                        className="bg-[#F43F5E] hover:bg-rose-600 text-white border-none px-4 py-2.5 rounded-xl cursor-pointer font-semibold text-sm transition-colors" 
                        onClick={() => setIsBs(!isBs)}
                    >
                        Ver en {isBs ? 'Dólares ($)' : 'Bolívares (Bs)'}
                    </button>
                </div>

                {/* Formulario ahora con fondo blanco y bordes sutiles */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-8">
                    <form className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1fr_1fr_auto] gap-4 items-end" onSubmit={handleAgregar}>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-600 mb-1.5 block">Tipo</label>
                            <select 
                                className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none w-full focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" 
                                value={nuevoRegistro.categoria} 
                                onChange={(e) => setNuevoRegistro({...nuevoRegistro, categoria: e.target.value})}
                            >
                                <option value="Proveedor">📦 Proveedor</option>
                                <option value="Gasto">🏠 Servicio/Gasto</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-600 mb-1.5 block">Descripción</label>
                            <input 
                                className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none w-full focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" 
                                type="text" 
                                placeholder="Detalle..." 
                                required 
                                value={nuevoRegistro.desc} 
                                onChange={(e) => setNuevoRegistro({...nuevoRegistro, desc: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-600 mb-1.5 block">Monto ($)</label>
                            <input 
                                className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none w-full focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" 
                                type="number" 
                                step="0.01" 
                                required 
                                value={nuevoRegistro.montoUSD} 
                                onChange={(e) => setNuevoRegistro({...nuevoRegistro, montoUSD: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-600 mb-1.5 block">Estado</label>
                            <select 
                                className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none w-full focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" 
                                value={nuevoRegistro.estado} 
                                onChange={(e) => setNuevoRegistro({...nuevoRegistro, estado: e.target.value})}
                            >
                                <option value="Por Pagar">Por Pagar</option>
                                <option value="Pagado">Pagado</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-5 py-2.5 rounded-lg cursor-pointer font-bold h-[42px] transition-colors shadow-sm">
                            + Registrar
                        </button>
                    </form>
                </div>

                {/* TABLAS */}
                {[ {titulo: "📦 Cuentas de Proveedores", data: proveedores}, 
                   {titulo: "🏠 Gastos Operativos", data: gastosOperativos} ].map((seccion, idx) => (
                    <div className="bg-white p-6 rounded-2xl mb-6 border border-slate-200 shadow-sm" key={idx}>
                        <h2 className="text-lg text-slate-800 mb-4 border-l-4 border-[#F43F5E] pl-3 font-bold">
                            {seccion.titulo}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Descripción</th>
                                        <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Monto</th>
                                        <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Referencia</th>
                                        <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Estado</th>
                                        <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {seccion.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3.5 border-b border-slate-100 text-sm text-slate-800 font-semibold">{c.desc}</td>
                                            <td className="p-3.5 border-b border-slate-100 text-sm text-slate-800 font-bold">{renderMontoPrioritario(c.montoUSD)}</td>
                                            <td className="p-3.5 border-b border-slate-100 text-xs text-slate-500">{renderMontoSecundario(c.montoUSD)}</td>
                                            <td className="p-3.5 border-b border-slate-100 text-sm">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${c.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
                                                    {c.estado === 'Pagado' ? 'PAGADO' : 'POR PAGAR'}
                                                </span>
                                            </td>
                                            <td className="p-3.5 border-b border-slate-100 text-sm">
                                                {c.soporte ? (
                                                    <span className="text-emerald-600 text-xs font-semibold">✅ Recibo listo</span>
                                                ) : (
                                                    <button 
                                                        className="text-[#F43F5E] cursor-pointer text-xs font-bold border border-rose-200 bg-white px-3 py-1.5 rounded-md transition-colors hover:bg-[#F43F5E] hover:text-white" 
                                                        onClick={() => activarSoporte(c.id)}
                                                    >
                                                        📎 Subir Soporte
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Egresos_Gastos;
