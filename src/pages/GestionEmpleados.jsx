import React, { useState, useEffect } from 'react';
import '../assets/GestionEmpleados.css';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios.js';

export const GestionEmpleados = () => {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ visible: false, empleado: null });

    // Búsqueda y Ordenamiento
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('nombre'); // 'nombre', 'cargo', 'comision'

    // Status Trabajando
    const [statusTrabajando, setStatusTrabajando] = useState(() => {
        const saved = localStorage.getItem('statusEmpleados');
        return saved ? JSON.parse(saved) : {};
    });

    const toggleStatus = (id) => {
        const current = statusTrabajando[id] || false;
        const newStatus = { ...statusTrabajando, [id]: !current };
        setStatusTrabajando(newStatus);
        localStorage.setItem('statusEmpleados', JSON.stringify(newStatus));
    };

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                setLoading(true);
                const response = await api.get('/empleados');
                const dataPayload = response.data.data;

                // Extracción Inteligente
                let empleadosArray = [];
                if (Array.isArray(dataPayload)) {
                    empleadosArray = dataPayload;
                } else if (dataPayload && Array.isArray(dataPayload.empleados)) {
                    empleadosArray = dataPayload.empleados;
                }

                // Preservamos el acumulado mock si no viene de DB
                const dataWithMock = empleadosArray.map(emp => {
                    const sueldoBase = Number(emp.sueldo_base || 0);
                    const comisionFija = Number(emp.monto_comision_fija || 0);
                    
                    const realOS = emp._count?.ordenes || 0;
                    const osFinalizadas = realOS > 0 ? realOS : 0; 
                    const comisionProduccion = osFinalizadas * (comisionFija || 15);
                    const bonoCalidad = osFinalizadas > 3 ? 50.00 : 0.00;
                    const retenciones = sueldoBase > 500 ? 45.00 : 0.00;
                    const totalCalculado = sueldoBase + comisionProduccion + bonoCalidad - retenciones;

                    const totalPagado = (emp.nominas || [])
                        .filter(n => n.tipo_pago === 'liquidacion')
                        .reduce((acc, curr) => acc + Number(curr.monto_total || 0), 0);

                    let montoAcumulado = totalCalculado - totalPagado;
                    if (montoAcumulado < 0) montoAcumulado = 0;

                    return {
                        ...emp,
                        sueldo_base: sueldoBase,
                        monto_comision_fija: comisionFija,
                        acumulado: montoAcumulado
                    };
                });
                setEmpleados(dataWithMock);
                setFeedback(null);
            } catch (err) {
                console.error("Error cargando empleados", err);
                setFeedback({
                    tipo: 'error',
                    mensaje: err.response?.data?.error || 'Error al cargar la lista de empleados'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchEmpleados();
    }, []);

    const confirmarLiquidarPago = (emp) => {
        setConfirmDialog({ visible: true, empleado: emp });
    };

    const procesarPago = async () => {
        const { empleado } = confirmDialog;
        setConfirmDialog({ visible: false, empleado: null });

        try {
            await api.post('/nomina/pagar', {
                id_empleado: empleado.id_empleado,
                monto_total: empleado.acumulado
            });

            setEmpleados(empleados.map(emp =>
                emp.id_empleado === empleado.id_empleado ? { ...emp, acumulado: 0 } : emp
            ));
            setFeedback({ tipo: 'ok', mensaje: 'Liquidación registrada exitosamente' });
            setTimeout(() => setFeedback(null), 3000);
        } catch(err) {
            console.error("Error al pagar:", err);
            if (err.response?.status === 400 && err.response.data?.errors) {
                const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                setFeedback({ tipo: 'error', mensaje: msgs });
            } else {
                setFeedback({ tipo: 'error', mensaje: err.response?.data?.error || "Error de conexión al pagar." });
            }
            setTimeout(() => setFeedback(null), 4500);
        }
    };

    // Filtrar y ordenar
    const filteredEmpleados = empleados
        .filter(emp => {
            const term = searchTerm.toLowerCase();
            return (emp.nombre?.toLowerCase().includes(term) || 
                    emp.apellido?.toLowerCase().includes(term) || 
                    emp.cargo?.toLowerCase().includes(term));
        })
        .sort((a, b) => {
            if (sortBy === 'nombre') return (a.nombre || '').localeCompare(b.nombre || '');
            if (sortBy === 'cargo') return (a.cargo || '').localeCompare(b.cargo || '');
            if (sortBy === 'comision') return (b.monto_comision_fija || 0) - (a.monto_comision_fija || 0); // Descendente
            return 0;
        });

    const totalPasivo = filteredEmpleados.reduce((acc, emp) => acc + (emp.acumulado || 0), 0);

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' },
        info:  { backgroundColor: '#E0F2FE', color: '#0C4A6E', border: '1px solid #7DD3FC' }
    };

    return (
        <div className="nomina-container p-8 text-slate-main">
            <header className='flex justify-between items-center mb-10'>
                <div>
                    <h1 className="text-3xl font-black text-slate-main">
                        Gestión de <span className="text-pink-accent">Empleados y Nómina</span>
                    </h1>
                    <p className="text-slate-500 italic text-sm">Control administrativo de empleados.</p>
                </div>
                <button onClick={() => navigate('/panel/RegistroEmpleado')} className="btn-registrar-pink">
                    Registrar Nuevo Empleado
                </button>
            </header>

            {/* FEEDBACK */}
            {feedback && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-[200]`} style={feedbackStyles[feedback.tipo]}>
                    <p className="font-bold text-sm tracking-wide">{feedback.mensaje}</p>
                </div>
            )}

            {/* Modal Confirmación de Liquidación */}
            {confirmDialog.visible && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-2">Confirmar Liquidación</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            ¿Seguro que deseas liquidar los haberes pendientes de <span className="font-bold text-slate-800">{confirmDialog.empleado?.nombre} {confirmDialog.empleado?.apellido}</span>?
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setConfirmDialog({ visible: false, empleado: null })}
                                className="flex-1 cursor-pointer bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-sm"
                            >
                                CANCELAR
                            </button>
                            <button 
                                onClick={procesarPago}
                                className="flex-1 cursor-pointer bg-[#F43F5E] text-white font-black py-3 rounded-xl hover:bg-rose-600 shadow-md transition-all text-sm"
                            >
                                SÍ, LIQUIDAR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Pasivo Laboral (Filtro)</p>
                    <p className="text-5xl font-black text-slate-main tracking-tighter">${totalPasivo.toLocaleString('es-ES')}</p>
                    <p className="text-pink-accent text-sm font-bold mt-2 italic">Monto pendiente por liquidar.</p>
                </div>

                {/* Buscador y Filtros */}
                <div className='bg-rose-50 p-8 rounded-3xl border border-rose-100 flex flex-col justify-center gap-4'>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">Buscar Empleado / Especialidad</label>
                        <input 
                            type="search" 
                            placeholder="Ej. Juan, Frenos..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 bg-white rounded-xl border border-rose-200 outline-none focus:border-pink-accent"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">Ordenar Por</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3 bg-white rounded-xl border border-rose-200 outline-none focus:border-pink-accent"
                        >
                            <option value="nombre">Orden Alfabético (Nombre)</option>
                            <option value="cargo">Especialidad / Cargo</option>
                            <option value="comision">Mayor Comisión Base</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="flex justify-center items-center h-[300px] text-slate-400 font-bold">Cargando Empleados...</div>
                ) : (
                    <table className="w-full">
                        <thead className='bg-slate-50'>
                            <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                                <th className="px-8 py-4 text-left">Mecánico / Especialidad</th>
                                <th className="px-8 py-4 text-center">Estado Laboral</th>
                                <th className="px-8 py-4 text-center">Sueldo / Comisión</th>
                                <th className="px-8 py-4 text-left">Acumulado</th>
                                <th className="px-8 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {filteredEmpleados.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-slate-400 font-medium">No se encontraron empleados.</td>
                                </tr>
                            )}
                            {filteredEmpleados.map((emp) => (
                                <tr key={emp.id_empleado} className="hover:bg-rose-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <p className="text-slate-main font-bold uppercase text-sm">{emp.nombre} {emp.apellido}</p>
                                        <p className="text-slate-400 text-xs italic">{emp.cargo}</p>
                                        <p className="text-slate-300 text-[10px] mt-1">ID: {emp.id_empleado}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button 
                                            onClick={() => toggleStatus(emp.id_empleado)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all uppercase ${
                                                statusTrabajando[emp.id_empleado] 
                                                ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200' 
                                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                                            }`}
                                        >
                                            {statusTrabajando[emp.id_empleado] ? '🟢 Trabajando' : '⚪ En Pausa'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-center font-mono font-medium text-slate-500">
                                        Base: ${Number(emp.sueldo_base || 0).toFixed(2)}<br/>
                                        Com: {emp.aplica_comision ? `$${Number(emp.monto_comision_fija || 0).toFixed(2)}` : 'N/A'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-2xl font-black ${(emp.acumulado || 0) > 0 ? 'text-slate-main' : 'text-slate-200'}`}>
                                            ${(emp.acumulado || 0).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center items-center gap-2">
                                            <button 
                                                onClick={() => navigate(`/panel/EditarEmpleado/${emp.id_empleado}`)}
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                                title="Editar Datos"
                                            >
                                                Editar
                                            </button>
                                            {(emp.acumulado || 0) > 0 ? (
                                                <button onClick={() => confirmarLiquidarPago(emp)} className="btn-liquidar-pink px-4 py-2 rounded-xl">
                                                    Liquidar Pago
                                                </button>
                                            ) : (
                                                <div className="bg-green-50 text-green-success border border-green-200 px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center justify-center cursor-default">
                                                    Pagado
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GestionEmpleados;
