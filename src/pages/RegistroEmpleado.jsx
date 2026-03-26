import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegistroEmpleado = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        cargo: "Mecanico",
        comision: 30
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Empleado registrado:", formData);
        alert(`¡Empleado ${formData.nombre} ${formData.apellido} registrado con éxito!`);
        navigate('/panel/GestionEmpleados');
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white rounded-3xl shadow-2xl mt-10 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-main mb-6">
                Registro de Nuevo <span className='text-pink-accent'>Empleado</span>
            </h2>

            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Nombre</label>
                    <input
                        type="text" name="nombre"
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        onChange={handleChange} required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Apellido</label>
                    <input
                        type="text" name="apellido"
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        onChange={handleChange} required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Cargo en Taller</label>
                    <select
                        name="cargo"
                        className='w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-accent outline-none'
                        onChange={handleChange} 
                    >
                        <option value="Mecanico">Mecánico</option>
                        <option value="Tecnico">Técnico Especialista</option>
                        <option value="Supervisor">Supervisor de Patio</option>
                    </select>
                </div>

                <button type="submit" className='bg-pink-accent text-white font-bold py-4 rounded-2xl mt-4 hover:opacity-90 transition-all shadow-lg shadow-pink-accent'>
                    Guardar Empleado
                </button>
            </form>
        </div>
    );
};