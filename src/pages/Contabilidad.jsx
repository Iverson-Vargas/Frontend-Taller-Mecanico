import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';

export const Contabilidad = () => {
    // --- ESTADOS DE CONFIGURACIÓN ---
    const [exchangeRate, setExchangeRate] = useState(() => {
        const saved = localStorage.getItem('tasa_cambio');
        return saved ? parseFloat(saved) : 36.50;
    });
    const [isBs, setIsBs] = useState(false);
    const [viewMode, setViewMode] = useState('Global'); // 'Global' o 'Personal'

    // Persistir tasa cuando cambie
    useEffect(() => {
        localStorage.setItem('tasa_cambio', exchangeRate.toString());
    }, [exchangeRate]);
    
    // --- ESTADOS DE FILTROS ---
    const [filterPeriod, setFilterPeriod] = useState('Mes');
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // --- ESTADOS DE DATOS ---
    const [cuentas, setCuentas] = useState([]);
    const [proveedoresDB, setProveedoresDB] = useState([]);
    const [resumenGlobal, setResumenGlobal] = useState({ totalMes: 0, pendiente: 0, pagado: 0 });
    const [resumenPersonal, setResumenPersonal] = useState({ totalMes: 0, pendiente: 0, pagado: 0 });
    
    const [nuevoRegistro, setNuevoRegistro] = useState({
        tipo: 'Gasto',
        categoria: 'Gastos Operativos',
        id_proveedor: '',
        desc: '',
        montoUSD: '',
        estado: 'POR PAGAR'
    });

    const [searchTerm, setSearchTerm] = useState('');

    // --- ESTADOS PROVEEDOR ---
    const [showModalProv, setShowModalProv] = useState(false);
    const [nuevoProv, setNuevoProv] = useState({
        rif: '',
        nombre_empresa: '',
        especialidad: '',
        nombre_contacto: '',
        apellido_contacto: ''
    });

    // --- CATEGORIAS ---
    const categoriasGasto = [
        "Servicios Públicos (Luz/Agua/Internet)",
        "Herramientas e Insumos",
        "Gastos Operativos (Papelería/Limpieza)",
        "Mantenimiento de Local",
        "Publicidad y Marketing",
        "Otros Gastos"
    ];

    // 1. CARGAR DATOS (GET)
    const fetchContabilidad = async () => {
        const rawUser = localStorage.getItem('usuario');
        let cedulaActual = '';
        if (rawUser && rawUser !== "undefined") {
            try {
                const storageUser = JSON.parse(rawUser);
                cedulaActual = storageUser?.cedula_rif || '';
            } catch (err) { console.error(err); }
        }

        try {
            const url = `http://localhost:3001/api/contabilidad?usuarioLogueado=${cedulaActual}&startDate=${startDate}&endDate=${endDate}`;
            const response = await axios.get(url);

            const dataGastos = response.data.gastos || [];
            const dataCompras = response.data.compras || [];
            
            if (response.data.resumenGlobal) setResumenGlobal(response.data.resumenGlobal);
            if (response.data.resumenPersonal) setResumenPersonal(response.data.resumenPersonal);

            const dataTransformada = [
                ...dataGastos.map(g => ({
                    id: g.id_gasto,
                    categoria: g.categoria || 'Gasto',
                    tipo: 'Gasto',
                    desc: g.descripcion,
                    montoUSD: parseFloat(g.monto),
                    estado: g.estado === 'PAGADO' ? 'PAGADO' : 'POR PAGAR',
                    fecha: g.fecha,
                    usuario: g.usuario?.nombre || 'Sistema',
                    proveedor_nombre: g.proveedor?.nombre_empresa || 'N/A'
                })),
                ...dataCompras.map(c => ({
                    id: c.id_compra,
                    categoria: 'Proveedor / Repuestos',
                    tipo: 'Compra',
                    desc: c.descripcion || `Compra #${c.id_compra}`,
                    montoUSD: parseFloat(c.monto_total),
                    estado: c.estado === 'PAGADO' ? 'PAGADO' : 'POR PAGAR',
                    fecha: c.fecha,
                    usuario: c.usuario?.nombre || 'Sistema',
                    proveedor_nombre: c.proveedor?.nombre_empresa || 'Proveedor General'
                }))
            ];

            dataTransformada.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setCuentas(dataTransformada);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    const fetchProveedores = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/contabilidad/proveedores');
            // La respuesta ya trae el array directamente según el controlador
            setProveedoresDB(Array.isArray(res.data) ? res.data : []);
        } catch (error) { console.error("Error cargando proveedores", error); }
    };

    useEffect(() => {
        fetchContabilidad();
        fetchProveedores();
    }, [startDate, endDate]);

    // HANDLERS DE FILTROS RÁPIDOS
    const handleFilterPreset = (preset) => {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        if (preset === 'Hoy') {
            start = now;
        } else if (preset === 'Semana') {
            const day = now.getDay() || 7;
            start.setHours(-24 * (day - 1));
        } else if (preset === 'Mes') {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        setFilterPeriod(preset);
    };

    // 2. REGISTRAR CONTABILIDAD (POST)
    const handleAgregar = async (e) => {
        e.preventDefault();
        const rawUser = localStorage.getItem('usuario');
        let cedulaActiva = null;

        if (rawUser && rawUser !== "undefined") {
            try {
                const storageUser = JSON.parse(rawUser);
                cedulaActiva = storageUser?.cedula_rif;
            } catch (err) { console.error(err); }
        }

        if (!cedulaActiva) {
            alert("⚠️ No hay una sesión activa. Por favor, inicia sesión de nuevo.");
            return;
        }

        try {
            const data = {
                tipo: nuevoRegistro.tipo,
                categoria: nuevoRegistro.tipo === 'Compra' ? 'Repuestos' : nuevoRegistro.categoria,
                id_proveedor: nuevoRegistro.tipo === 'Compra' ? nuevoRegistro.id_proveedor : null,
                descripcion: nuevoRegistro.desc,
                monto: parseFloat(nuevoRegistro.montoUSD),
                estado: nuevoRegistro.estado,
                usuarioLogueado: cedulaActiva
            };

            console.log("DEBUG - Enviando a Contabilidad:", data);

            await axios.post('http://localhost:3001/api/contabilidad', data);
            alert(`✅ Registrado correctamente`);
            setNuevoRegistro({ ...nuevoRegistro, desc: '', montoUSD: '', id_proveedor: '' });
            fetchContabilidad();
        } catch (error) {
            console.error("Error al guardar:", error);
            const msg = error.response?.data?.message || "Error al guardar el registro";
            alert(`❌ ${msg}`);
        }
    };

    const handleGuardarProveedor = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/contabilidad/proveedores', nuevoProv);
            alert(`✅ Proveedor "${nuevoProv.nombre_empresa}" registrado`);
            setShowModalProv(false); // No lo cerramos para que pueda ver la lista actualizada si quiere
            setNuevoProv({ rif: '', nombre_empresa: '', especialidad: '', nombre_contacto: '', apellido_contacto: '' });
            fetchProveedores(); // Refrescar lista
        } catch (error) {
            console.error(error);
            alert("❌ Error al registrar proveedor");
        }
    };

    const handleEliminarProveedor = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este proveedor?")) {
            try {
                const res = await axios.delete(`http://localhost:3001/api/contabilidad/proveedores/${id}`);
                alert(`✅ ${res.data.message}`);
                fetchProveedores();
            } catch (error) {
                console.error(error);
                const msg = error.response?.data?.message || "Error al eliminar proveedor";
                alert(`❌ ${msg}`);
            }
        }
    };

    // 3. ACTUALIZAR ESTADO A PAGADO (PATCH)
    const handlePagar = async (id, tipo) => {
        try {
            await axios.patch('http://localhost:3001/api/contabilidad/pagar', { id, tipo });
            fetchContabilidad();
        } catch (error) {
            console.error("Error al pagar:", error);
        }
    };

    // 4. ELIMINAR REGISTRO (DELETE)
    const handleEliminar = async (id, tipo) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            try {
                await axios.delete(`http://localhost:3001/api/contabilidad/${id}?tipo=${tipo}`);
                fetchContabilidad();
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    // EXPORTAR A PDF (Simulado con Ventana de Impresión Profesional)
    const handleExportPDF = () => {
        const printWindow = window.open('', '_blank');
        const filteredCuentas = cuentas;
        const totalUSD = filteredCuentas.reduce((acc, c) => acc + c.montoUSD, 0);
        const totalBs = totalUSD * exchangeRate;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte de Contabilidad - Taller Mecánico</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #333; }
                        .header { text-align: center; border-bottom: 2px solid #F43F5E; padding-bottom: 20px; margin-bottom: 30px; }
                        h1 { color: #F43F5E; margin: 0; }
                        .info { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; }
                        td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
                        .total-box { background: #f8fafc; padding: 20px; border-radius: 10px; text-align: right; }
                        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; }
                        .user-badge { font-size: 10px; color: #64748b; text-transform: uppercase; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Taller Mecánico Profesional</h1>
                        <p>Reporte Consolidado de Egresos</p>
                    </div>
                    <div class="info">
                        <div><strong>Periodo:</strong> ${startDate} al ${endDate}</div>
                        <div><strong>Filtro:</strong> ${viewMode}</div>
                        <div><strong>Generado:</strong> ${new Date().toLocaleString()}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo / Cat</th>
                                <th>Descripción / Proveedor</th>
                                <th>Usuario</th>
                                <th>Monto (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredCuentas.map(c => `
                                <tr>
                                    <td>${new Date(c.fecha).toLocaleDateString()}</td>
                                    <td>${c.tipo}<br/><small>${c.categoria}</small></td>
                                    <td>${c.desc} ${c.tipo === 'Compra' ? `<br/><small style="color: #F43F5E">Prov: ${c.proveedor_nombre}</small>` : ''}</td>
                                    <td><span class="user-badge">${c.usuario}</span></td>
                                    <td>$${c.montoUSD.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total-box">
                        <p style="font-size: 18px; font-weight: 900;">TOTAL USD: $${totalUSD.toFixed(2)}</p>
                        <p style="font-size: 14px; color: #64748b;">Equivalente en Bs (Tasa ${exchangeRate}): ${totalBs.toLocaleString('es-VE')} Bs</p>
                    </div>
                    <div class="footer">Este documento es un reporte administrativo interno generado por el sistema.</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Seleccionar resumen basado en el modo de vista
    const resumenMostrar = viewMode === 'Global' ? resumenGlobal : (resumenPersonal || resumenGlobal);

    const formatCurrency = (usd) => {
        if (isBs) return (usd * exchangeRate).toLocaleString('es-VE') + ' Bs';
        return '$' + usd.toFixed(2);
    };

    // FILTRO DE BUSQUEDA EN TABLA
    const cuentasFiltradas = useMemo(() => {
        return cuentas.filter(c => 
            c.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.proveedor_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.categoria.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [cuentas, searchTerm]);

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-10 font-sans overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                
                {/* CABECERA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl text-slate-800 font-black tracking-tight">
                            Gestión <span className="text-[#F43F5E]">Contable</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Control de gastos operativos y compras a proveedores vinculados.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* INPUT TASA DE CAMBIO */}
                        <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400">TASA BCV (Bs):</span>
                            <input 
                                type="number" 
                                step="0.01"
                                value={exchangeRate}
                                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                                className="w-16 text-sm font-black text-slate-800 outline-none bg-transparent"
                            />
                        </div>

                        <button 
                            onClick={handleExportPDF}
                            className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            📄 Generar Reporte
                        </button>
                        <button 
                            onClick={() => setIsBs(!isBs)}
                            className="bg-[#F43F5E] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-rose-600 transition-all"
                        >
                            {isBs ? 'Ver en USD' : 'Ver en BS'}
                        </button>
                    </div>
                </div>

                {/* SELECTOR DE MODO DASHBOARD */}
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-200 p-1 rounded-2xl flex gap-1 shadow-inner">
                        <button 
                            onClick={() => setViewMode('Global')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'Global' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            🌍 TODO EL TALLER
                        </button>
                        <button 
                            onClick={() => setViewMode('Personal')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'Personal' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            👤 MIS GASTOS
                        </button>
                    </div>
                </div>

                {/* DASHBOARD DE TOTALES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gastos del Periodo ({viewMode})</p>
                        <h3 className="text-3xl font-black text-slate-800">{formatCurrency(viewMode === 'Global' ? resumenGlobal.totalMes : resumenPersonal.totalMes)}</h3>
                        <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">Periodo seleccionado</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500 transition-all hover:shadow-md">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pendiente por Pagar</p>
                        <h3 className="text-3xl font-black text-rose-600">{formatCurrency(viewMode === 'Global' ? resumenGlobal.pendiente : resumenPersonal.pendiente)}</h3>
                        <p className="text-xs text-slate-400 mt-2">Cuentas por liquidar</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500 transition-all hover:shadow-md">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Pagado</p>
                        <h3 className="text-3xl font-black text-emerald-600">{formatCurrency(viewMode === 'Global' ? resumenGlobal.pagado : resumenPersonal.pagado)}</h3>
                        <p className="text-xs text-slate-400 mt-2 flex justify-between">
                            <span>Relación:</span>
                            <span>{Math.round(((viewMode === 'Global' ? resumenGlobal.pagado : resumenPersonal.pagado)/(viewMode === 'Global' ? resumenGlobal.totalMes : resumenPersonal.totalMes))*100) || 0}% del total</span>
                        </p>
                    </div>
                </div>

                {/* BARRA DE FILTROS */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        {['Hoy', 'Semana', 'Mes'].map(p => (
                            <button
                                key={p}
                                onClick={() => handleFilterPreset(p)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterPeriod === p ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <input 
                            type="date" 
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setFilterPeriod('Personalizado'); }}
                        />
                        <span className="text-slate-400 font-black">/</span>
                        <input 
                            type="date" 
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setFilterPeriod('Personalizado'); }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
                    
                    {/* FORMULARIO */}
                    <aside className="min-w-0">
                        <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm sticky top-8">
                            <h2 className="text-xl font-black text-slate-800 mb-6">Nuevo Registro</h2>
                            <form className="space-y-4" onSubmit={handleAgregar}>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Tipo de Movimiento</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                                        <button 
                                            type="button"
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${nuevoRegistro.tipo === 'Gasto' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
                                            onClick={() => setNuevoRegistro({...nuevoRegistro, tipo: 'Gasto'})}
                                        >🏠 Gasto</button>
                                        <button 
                                            type="button"
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${nuevoRegistro.tipo === 'Compra' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                            onClick={() => setNuevoRegistro({...nuevoRegistro, tipo: 'Compra'})}
                                        >📦 Compra</button>
                                    </div>
                                </div>

                                {nuevoRegistro.tipo === 'Compra' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Seleccionar Proveedor</label>
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={nuevoRegistro.id_proveedor}
                                            onChange={(e) => setNuevoRegistro({...nuevoRegistro, id_proveedor: e.target.value})}
                                            required
                                        >
                                            <option value="">-- Buscar Proveedor --</option>
                                            {proveedoresDB.map(p => (
                                                <option key={p.id_proveedor} value={p.id_proveedor}>
                                                    {p.nombre_empresa} ({p.especialidad || 'Sin rubro'})
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowModalProv(true)}
                                            className="w-full mt-2 bg-rose-50 border-2 border-dashed border-rose-200 text-rose-500 py-2.5 rounded-xl text-xs font-black hover:bg-rose-100 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
                                        >
                                            ➕ GESTIONAR PROVEEDORES
                                        </button>
                                    </div>
                                )}

                                {nuevoRegistro.tipo === 'Gasto' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Categoría</label>
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                                            value={nuevoRegistro.categoria}
                                            onChange={(e) => setNuevoRegistro({...nuevoRegistro, categoria: e.target.value})}
                                        >
                                            {categoriasGasto.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Descripción del Movimiento</label>
                                    <input 
                                        type="text" required 
                                        placeholder={nuevoRegistro.tipo === 'Compra' 
                                            ? "Ej. 10 Pailas de Aceite 20W50, 5 Filtros de Aire, etc." 
                                            : "Ej. Pago de electricidad, Alquiler, Papelería, etc."
                                        }
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                                        value={nuevoRegistro.desc}
                                        onChange={(e) => setNuevoRegistro({...nuevoRegistro, desc: e.target.value})}
                                    />
                                    <p className="text-[9px] text-slate-400 mt-1 ml-1 font-medium italic">
                                        {nuevoRegistro.tipo === 'Compra' 
                                            ? "Indica qué repuestos o insumos estás adquiriendo." 
                                            : "Especifica el motivo exacto del gasto operativo."
                                        }
                                    </p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Monto en Dólares ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                        <input 
                                            type="number" step="0.01" required placeholder="0.00"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-black focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={nuevoRegistro.montoUSD}
                                            onChange={(e) => setNuevoRegistro({...nuevoRegistro, montoUSD: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 mt-4">
                                    REGISTRAR MOVIMIENTO
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* TABLA */}
                    <main className="min-w-0">
                        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/30 gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Cuentas y Registros</h2>
                                    <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                        {cuentasFiltradas.length} Movimientos
                                    </span>
                                </div>
                                <div className="w-full md:w-80">
                                    <input 
                                        type="text" 
                                        placeholder="🔍 BUSCAR (Proveedor, descripción...)" 
                                        className="w-full bg-white border-2 border-[#F43F5E]/20 rounded-xl px-4 py-2.5 text-xs font-black focus:ring-4 focus:ring-[#F43F5E]/10 outline-none shadow-md transition-all placeholder:text-slate-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase">Detalle / Usuario</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase">Categoría</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase">Monto / Estado</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {cuentasFiltradas.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-20 text-center text-slate-400 font-medium">No se encontraron resultados para "{searchTerm}".</td>
                                            </tr>
                                        ) : (
                                            cuentasFiltradas.map(c => (
                                                <tr key={c.id + c.tipo} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-bold text-slate-800">{c.desc}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-slate-400 font-bold">{new Date(c.fecha).toLocaleDateString()}</span>
                                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase">Por: {c.usuario}</span>
                                                            {c.tipo === 'Compra' && (
                                                                <>
                                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                                    <span className="text-[10px] text-rose-400 font-bold uppercase">Prov: {c.proveedor_nombre}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${c.tipo === 'Gasto' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {c.categoria}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-black text-slate-800">{formatCurrency(c.montoUSD)}</p>
                                                        <span className={`text-[10px] font-black underline ${c.estado === 'PAGADO' ? 'text-emerald-500' : 'text-rose-400'}`}>
                                                            {c.estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            {c.estado !== 'PAGADO' && (
                                                                <button 
                                                                    onClick={() => handlePagar(c.id, c.tipo)}
                                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                                    title="Marcar como pagado"
                                                                >✓</button>
                                                            )}
                                                            <button 
                                                                onClick={() => handleEliminar(c.id, c.tipo)}
                                                                className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                                title="Eliminar registro"
                                                            >🗑</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* MODAL GESTIÓN DE PROVEEDORES */}
            {showModalProv && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-h-[90vh]">
                        
                        {/* FORMULARIO DE REGISTRO */}
                        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 flex-1 overflow-y-auto">
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Registrar Nuevo</h2>
                            <p className="text-slate-500 text-sm mb-6">Añade los datos fiscales de tu nuevo proveedor.</p>
                            
                            <form onSubmit={handleGuardarProveedor} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">RIF / Registro Fiscal</label>
                                    <input 
                                        type="text" required placeholder="J-12345678-9"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#F43F5E] outline-none"
                                        value={nuevoProv.rif}
                                        onChange={(e) => setNuevoProv({...nuevoProv, rif: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Nombre de la Empresa</label>
                                    <input 
                                        type="text" required placeholder="Ej. Repuestos El Chino C.A."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#F43F5E] outline-none"
                                        value={nuevoProv.nombre_empresa}
                                        onChange={(e) => setNuevoProv({...nuevoProv, nombre_empresa: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">¿Qué vende? (Especialidad)</label>
                                    <input 
                                        type="text" placeholder="Ej. Aceites, Frenos, Amortiguadores..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#F43F5E] outline-none"
                                        value={nuevoProv.especialidad}
                                        onChange={(e) => setNuevoProv({...nuevoProv, especialidad: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Nombre</label>
                                        <input 
                                            type="text" placeholder="Ej. Juan"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#F43F5E] outline-none"
                                            value={nuevoProv.nombre_contacto}
                                            onChange={(e) => setNuevoProv({...nuevoProv, nombre_contacto: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Apellido</label>
                                        <input 
                                            type="text" placeholder="Ej. Pérez"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#F43F5E] outline-none"
                                            value={nuevoProv.apellido_contacto}
                                            onChange={(e) => setNuevoProv({...nuevoProv, apellido_contacto: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModalProv(false)}
                                        className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all"
                                    >CERRAR</button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-slate-800 text-white font-black py-3.5 rounded-xl shadow-lg hover:bg-slate-900 transition-all"
                                    >GUARDAR</button>
                                </div>
                            </form>
                        </div>

                        {/* LISTADO DE PROVEEDORES EXISTENTES */}
                        <div className="p-8 bg-slate-50 flex-1 flex flex-col overflow-hidden">
                            <h2 className="text-xl font-black text-slate-800 mb-2">Proveedores Registrados</h2>
                            <p className="text-slate-500 text-xs mb-6">Gestiona o elimina proveedores de tu lista.</p>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {proveedoresDB.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400 font-medium text-sm italic">No hay proveedores registrados aún.</div>
                                ) : (
                                    proveedoresDB.map(p => (
                                        <div key={p.id_proveedor} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center group hover:border-[#F43F5E]/30 transition-all shadow-sm">
                                            <div className="overflow-hidden">
                                                <h4 className="font-black text-slate-800 text-sm truncate">{p.nombre_empresa}</h4>
                                                <p className="text-[11px] font-black text-[#F43F5E] uppercase tracking-tight truncate">{p.especialidad || 'Rubro no especificado'}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate mt-0.5">{p.rif} • {p.nombre_contacto || 'Sin contacto'}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleEliminarProveedor(p.id_proveedor)}
                                                className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                                title="Eliminar proveedor"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Contabilidad;
