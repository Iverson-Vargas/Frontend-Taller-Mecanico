import react, {useState} from 'react';
import '../assets/GestionEmpleados.css';
import { useNavigate } from 'react-router-dom';

export const GestionEmpleados = () => {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([
        {id:1, nombre: "jose", apellido: "pernalete", cargo: "Mecánico Senior", comision:30, acumulado: 850.00},
        {id:2, nombre: "Juan", apellido: "Rodríguez", cargo: "Especialista Frenos", comision: 25, acumulado: 420.00}
    ]);

    const totalPasivo = empleados.reduce((acc, emp) => acc + emp.acumulado, 0);

    const liquidarPago = (id) => {
        if(window.confirm("¿Confirmar liquidación de haberes?")) {
            setEmpleados(empleados.map(emp =>
                emp.id === id ? { ...emp, acumulado: 0 } : emp
            ));
        }
    };
    
    return (
        <div className="nomina-container p-8 text-slate-main">
            <header className='flex justify-between items-center mb-10'>
                <div>
                    <h1 className="text-3xl font-black text-slate-main">
                        Gestión de <span className="text-pink-accent">Empleados y Nómina</span>
                    </h1>
                    <p className="text-slate-500 italic text-sm">Control administrativo de comisiones por servicios finalizados.</p>
                </div>
                <button onClick={() => navigate('/panel/RegistroEmpleado')} className="btn-registrar-pink">
                    Registrar Nuevo Empleado
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 ">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Pasivo Laboral</p>
                    <p className="text-5xl font-black text-slate-main tracking-tighter">${totalPasivo.toLocaleString('es-ES')}               
                    </p>
                    <p className="text-pink-accent text-sm font-bold mt-2 italic">Monto pendiente por liquidar a mecánicos.</p>
                </div>

                <div className='bg-rose-50 p-8 rounded-3xl border border-rose-100 flex items-center justify-center text-center'>
                    <p className="text-pink-accent font-medium text-sm italic">
                        "Cada vez que una Orden de Servicio se marca como FINALIZADA, se suma la comisión automáticamente."
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
                <table className="w-full">
                    <thead className='bg-slate-50'>
                        <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                            <th className="px-8 py-4 text-left">Mecánico / Cargo</th>
                            <th className="px-8 py-4 text-center">% Comisión</th>
                            <th className="px-8 py-4 text-left">Acumulado</th>
                            <th className="px-8 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-50'>
                        {empleados.map((emp) => (
                            <tr key={emp.id} className="hover:bg-rose-50/30 transition-all">
                                <td className="px-8 py-6">
                                    <p className="text-slate-main font-bold uppercase text-sm">{emp.nombre} {emp.apellido}</p>
                                    <p className="text-slate-400 text-xs italic">{emp.cargo}</p>
                                </td>
                                <td className="px-8 py-6 text-center font-mono font-bold text-slate-500">
                                    {emp.comision}%
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`text-2xl font-black ${emp.acumulado > 0 ? 'text-slate-main' : 'text-slate-200'}`}>
                                        ${emp.acumulado.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {emp.acumulado > 0 ? (
                                        <button onClick={() => liquidarPago(emp.id)} className="btn-liquidar-pink">
                                            Liquidar Pago.
                                        </button>
                                    ) : (
                                        <span className="text-green-success font-bold text-xs tracking-widest uppercase">Pagado</span>
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