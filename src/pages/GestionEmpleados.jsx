import react, {useState} from 'react';
import '../assets/GestionEmpleados.css';
import { useNavigate } from 'react-router-dom';

export const GestionEmpleados = () => {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([
        {id:1, nombre: "jose", apellido: "pernalete", cargo: "mecanico senior", comision:30, acumulado: 850.00},
        { id: 2, nombre: "Juan Rodríguez", cargo: "Especialista Frenos", comision: 25, acumulado: 420.00 }
    ]);

    const totalPasivo = empleados.reduce((acc, emp) => acc + emp.acumulado, 0);

    const liquidarPago = (id) => {
        setEmpleados(empleados.map(emp =>
            emp.id === id ? { ...emp, acumulado: 0 } : emp
        ));
    };
    
    return (
        <div className="nomina-container p-8" style={{ color: '#1E293B' }}>
            <header className='flex justify-between items-center mb-10'>
                <div>
                    <h1 className="text-3xl font-black" style={{ color: '#1E293B' }}>
                        Gestión de <span style={{ color: '#F43F5E' }}>Empleados y Nomina </span>
                    </h1>
                    <p className="text-slate-500 italic text-sm">Control administrativo de comisiones por servicios finalizados.</p>
                </div>
                <button 
                    onClick={() => navigate('/Prueba/RegistroEmpleado')} 
                    style={{ backgroundColor: '#F43F5E', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold' }}
                >
                    Registrar Nuevo Empleado
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Card de Total Pasivo */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total pasivo laborales</p>
                    <p className="text-5xl font-black tracking-tighter" style={{ color: '#1E293B' }}>
                        ${totalPasivo.toLocaleString('es-ES')}               
                    </p>
                    <p style={{ color: '#F43F5E' }} className="text-sm font-bold mt-2 italic">Monto pendiente por liquidar a mecanico</p>
                </div>

                {/* Card Informativa */}
                <div style={{ backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' }} className='p-8 rounded-3xl border flex items-center justify-center'>
                    <p className="text-center font-medium" style={{ color: '#1E293B' }}>
                        "Cada vez que una Orden de Servicio se marca como <span style={{ color: '#F43F5E', fontWeight: 'bold' }}>FINALIZADA</span>, se suma la comisión automáticamente"
                    </p>
                </div>
            </div>

            {/* Tabla de empleados */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
                <table className="w-full">
                    <thead style={{ backgroundColor: '#F8FAFC' }}>
                        <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                            <th className="px-8 py-4 text-left">Mecánico / Cargo</th>
                            <th className="px-8 py-4 text-center">% Comisión</th>
                            <th className="px-8 py-4 text-left">Acumulado (Pendiente)</th>
                            <th className="px-8 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-50'>
                        {empleados.map((emp) => (
                            <tr key={emp.id} className="hover:bg-rose-50/30 transition-all">
                                <td className="px-8 py-6">
                                    <p className="font-bold" style={{ color: '#1E293B' }}>{emp.apellido}</p>
                                    <p className="text-slate-400 text-xs italic">{emp.cargo}</p>
                                </td>
                                <td className="px-8 py-6 text-center font-mono font-bold text-slate-600">
                                    {emp.comision}%
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`text-2xl font-black ${emp.acumulado > 0 ? 'text-slate-900' : 'text-slate-200'}`}>
                                        ${emp.acumulado.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {emp.acumulado > 0 ? (
                                        <button
                                            onClick={() => liquidarPago(emp.id)}
                                            style={{ backgroundColor: '#F43F5E', color: 'white', padding: '6px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                                        >
                                            Liquidar Pago
                                        </button>
                                    ) : (
                                        <span style={{ color: '#10B981' }} className="font-bold text-xs uppercase">Pagado</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};