import React, { useState, useRef } from 'react';

export const Egresos_Gastos = () => {
    const [exchangeRate, setExchangeRate] = useState(36.50);
    const [isBs, setIsBs] = useState(false);
    
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

    // Función para activar el selector de archivos
    const activarSoporte = (id) => {
        setSelectedId(id);
        fileInputRef.current.click();
    };

    // Función que procesa el archivo cargado
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && selectedId) {
            const nuevasCuentas = cuentas.map(c => {
                if (c.id === selectedId) {
                    return { 
                        ...c, 
                        soporte: file.name, 
                        estado: 'Pagado' // Al subir soporte, se marca como pagado
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
        <div className="dashboard-wrapper">
            <style>{`
                .dashboard-wrapper { background-color: #f1f5f9; min-height: 100vh; padding: 40px 20px; font-family: 'Inter', sans-serif; }
                .main-box { max-width: 1200px; margin: 0 auto; background-color: #e0f2fe; padding: 30px; border-radius: 24px; border: 2px solid #bae6fd; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
                .main-header { margin-bottom: 25px; }
                .main-header h1 { font-size: 28px; color: #0c4a6e; margin: 0; font-weight: 800; }
                .main-header h1 span { color: #0284c7; }
                .sub-text { color: #075985; font-size: 14px; margin-top: 5px; font-weight: 500; }

                .controls-row { display: flex; justify-content: flex-end; align-items: center; gap: 15px; margin-bottom: 20px; }
                .tasa-box { background: white; padding: 8px 15px; border-radius: 10px; border: 1px solid #bae6fd; font-size: 13px; color: #0369a1; font-weight: bold; }
                .btn-currency { background: #0369a1; color: white; border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 13px; }

                .form-container { background: #0369a1; padding: 25px; border-radius: 15px; margin-bottom: 30px; }
                .form-registro { display: grid; grid-template-columns: 1.2fr 2fr 1fr 1fr auto; gap: 15px; align-items: end; }
                .form-group label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #e0f2fe; margin-bottom: 6px; display: block; }
                .input-field { padding: 10px 14px; border-radius: 8px; border: none; background: white; color: #1e293b; font-size: 14px; outline: none; width: 100%; box-sizing: border-box; }
                .btn-add { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 700; height: 40px; }

                .seccion-tabla { background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 1px solid #bae6fd; }
                .seccion-tabla h2 { font-size: 16px; color: #0369a1; margin-bottom: 18px; border-left: 5px solid #0284c7; padding-left: 12px; }
                
                table { width: 100%; border-collapse: collapse; }
                th { text-align: left; padding: 14px; background: #f0f9ff; color: #0369a1; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e0f2fe; }
                td { padding: 14px; border-bottom: 1px solid #f8fafc; font-size: 14px; color: #334155; }
                
                .badge { padding: 5px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; }
                .status-pagado { background: #dcfce7; color: #166534; }
                .status-pendiente { background: #fee2e2; color: #991b1b; }
                
                .btn-soporte { color: #0284c7; cursor: pointer; font-size: 12px; font-weight: 700; border: 1px solid #e0f2fe; background: #f0f9ff; padding: 5px 10px; border-radius: 5px; transition: 0.2s; }
                .btn-soporte:hover { background: #0284c7; color: white; }
                .file-ready { color: #10b981; font-size: 12px; font-weight: 600; }
            `}</style>

            <div className="main-box">
                {/* Input de archivo oculto */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                />

                <header className="main-header">
                    <h1>Gestión de <span>Egresos</span></h1>
                    <p className="sub-text">Panel administrativo de proveedores y servicios operativos.</p>
                </header>

                <div className="controls-row">
                    <div className="tasa-box">Tasa BCV: {exchangeRate}</div>
                    <button className="btn-currency" onClick={() => setIsBs(!isBs)}>
                        Ver en {isBs ? 'Dólares ($)' : 'Bolívares (Bs)'}
                    </button>
                </div>

                <div className="form-container">
                    <form className="form-registro" onSubmit={handleAgregar}>
                        <div className="form-group">
                            <label>Tipo</label>
                            <select className="input-field" value={nuevoRegistro.categoria} onChange={(e) => setNuevoRegistro({...nuevoRegistro, categoria: e.target.value})}>
                                <option value="Proveedor">📦 Proveedor</option>
                                <option value="Gasto">🏠 Servicio/Gasto</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <input className="input-field" type="text" placeholder="Detalle..." required value={nuevoRegistro.desc} onChange={(e) => setNuevoRegistro({...nuevoRegistro, desc: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Monto ($)</label>
                            <input className="input-field" type="number" step="0.01" required value={nuevoRegistro.montoUSD} onChange={(e) => setNuevoRegistro({...nuevoRegistro, montoUSD: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <select className="input-field" value={nuevoRegistro.estado} onChange={(e) => setNuevoRegistro({...nuevoRegistro, estado: e.target.value})}>
                                <option value="Por Pagar">Por Pagar</option>
                                <option value="Pagado">Pagado</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-add">+ Registrar</button>
                    </form>
                </div>

                {/* TABLAS */}
                {[ {titulo: "📦 Cuentas de Proveedores", data: proveedores}, 
                   {titulo: "🏠 Gastos Operativos", data: gastosOperativos} ].map((seccion, idx) => (
                    <div className="seccion-tabla" key={idx}>
                        <h2>{seccion.titulo}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th>Monto</th>
                                    <th>Referencia</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seccion.data.map((c) => (
                                    <tr key={c.id}>
                                        <td><strong>{c.desc}</strong></td>
                                        <td style={{fontWeight: '700'}}>{renderMontoPrioritario(c.montoUSD)}</td>
                                        <td style={{color: '#64748b', fontSize: '12px'}}>{renderMontoSecundario(c.montoUSD)}</td>
                                        <td>
                                            <span className={`badge ${c.estado === 'Pagado' ? 'status-pagado' : 'status-pendiente'}`}>
                                                {c.estado === 'Pagado' ? 'PAGADO' : 'POR PAGAR'}
                                            </span>
                                        </td>
                                        <td>
                                            {c.soporte ? (
                                                <span className="file-ready">✅ Recibo listo</span>
                                            ) : (
                                                <button className="btn-soporte" onClick={() => activarSoporte(c.id)}>
                                                    📎 Subir Soporte
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Egresos_Gastos;