import react, {useState} from 'react';
import '../assets/GestionEmpleados.css';

export const GestionEmpleados = () => {
    const [empleados, setEmpleados] = useState([
        {id:1, nombre: "jose", apellido: "pernalete", cargo: "mecanico senior", comision:30, acumulado: 850.00},
        { id: 2, nombre: "Juan Rodríguez", cargo: "Especialista Frenos", comision: 25, acumulado: 420.00 }
    ]);

    //pasivo total
    const totalPasivo = empleados.reduce((acc, emp) => acc + emp.acumulado, 0);

    // Función para liquidar el pago de un empleado
    const liquidarPago = (id) => {
        setEmpleados(empleados.map(emp =>
            emp.id === id ? { ...emp, acumulado: 0 } : emp
        ));
    };
    
    return (
        <div className="nomina-container p-8 text-slate-800">
            <header className='flex justify-between items-center mb-10'>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">
                        Gestión de <span className="text-pink-accent">Empleados y Nomina </span>
                    </h1>
                    <p className="text-slate-500 italic text-sm">Control administrativo de comisiones por servicios finalizados.</p>
                </div>
                <button className="bg-pink-accent text-white font-bold py-3 px-6 rounded-2xl shadow-pink-accent hover:opacity-90 transition-all">
                    Registrar Empleados
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 ">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total pasivo laborales</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">${totalPasivo.toLocaleString('es-ES')}               
                    </p>
                    <p className="text-pink-accent text-sm font-bold mt-2 italic">Monto pendiente por liquidar a mecanico</p>
                </div>

                <div className='bg-pink-50 p-8 rounded-3xl border border-pink-100 flex items-center justify-center'>
                    <p className="bg-pink-50 p-8 rounded-3xl border border-pink-100 flex items-center justify-center">
                        "Cada vez que una Orden de Servicio se marca como FINALIZADA, se suma la comisión automáticamente"
                    </p>
                </div>
            </div>

            {/* tabla de empleados */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
                <table className="w-full">
                    <thead className='bg-slate-50'>
                        <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                            <th className="px-8 py-4 text-left">Mecánico / Cargo</th>
                            <th className="px-8 py-4 text-center">% Comisión</th>
                            <th className="px-8 py-4 text-left">Acumulado (Pendiente)</th>
                            <th className="px-8 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-50'>
`                       {empleados.map((emp) => (
                            <tr key={emp.id} className="hover:bg-pink-50/20 transition-all">
                                <td className="px-8 py-6">
                                    <p className="text-slate-900 font-bold">{emp.apellido}</p>
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
                                <td className="px-8 py -6 tet-center">
                                    {emp.acumulado > 0 ? (
                                        <button
                                          onClick={() => liquidarNomina(emp.id)}
                                          className="btn-liquidar-pink"
                                          >
                                            Liquidar Pago
                                          </button>
                                    ) : (
                                        <span className="text-green-500 font-bold text-xs">PAGADO </span>
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