import React, { useState, useEffect } from 'react';
import '../assets/GestionEmpleados.css';
import { useNavigate } from 'react-router-dom';

export const GestionEmpleados = () => {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);

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
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/empleados`);
                if(response.ok) {
                    const result = await response.json();
                    // El backend devuelve los empleados dentro de data.empleados
                    const empleadosArray = result.data?.empleados || [];
                    const dataWithMock = empleadosArray.map(emp => ({ ...emp, acumulado: emp.acumulado || 0 }));
                    setEmpleados(dataWithMock);
                }
            } catch (error) {
                console.error("Error cargando empleados", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmpleados();
    }, []);

    const liquidarPago = (id) => {
        if(window.confirm("¿Confirmar liquidación de haberes?")) {
            setEmpleados(empleados.map(emp =>
                emp.id_empleado === id ? { ...emp, acumulado: 0 } : emp
            ));
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
                                    <td colSpan="4" className="text-center py-10 text-slate-400 font-medium">No se encontraron empleados.</td>
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
                                    <td className="px-8 py-6 text-center space-x-2">
                                        <button 
                                            onClick={() => navigate(`/panel/EditarEmpleado/${emp.id_empleado}`)}
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                            title="Editar Datos"
                                        >
                                            Editar
                                        </button>
                                        {(emp.acumulado || 0) > 0 ? (
                                            <button onClick={() => liquidarPago(emp.id_empleado)} className="btn-liquidar-pink">
                                                Liquidar Pago
                                            </button>
                                        ) : (
                                            <span className="text-green-success font-bold text-xs tracking-widest uppercase bg-green-50 px-3 py-1 rounded-full">Pagado</span>
                                        )}
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