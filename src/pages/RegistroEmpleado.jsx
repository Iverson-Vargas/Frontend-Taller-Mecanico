import React,{ useState } from 'react';

export const RegistroEmpleado = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        cargo: "Mecanico",
        comision: 30
    });
// Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí se podría agregar lógica para enviar los datos a un servidor o actualizar el estado global
        console.log("empleado registrado:", formData);
        alert(`empleado ${formData.nombre} ${formData.apellido} registrado con éxito!`);
    };

    return (
        // Formulario de registro de empleado
        <div className="p-8 max-w-lg mx-auto bg-white rounded-3xl shadow-2xl mt-10 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
                Registro de Empleado <span className='text-pink-600'>Empleado</span>
            </h2>


            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div>
                    <label className='text-xs font-bold uppercase text-slate-400'>Nombre</label>
                    <input
                        type="text" name="nombre"
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500"
                        onChange={handleChange} required
                        />
                </div>

                <div>
                    <label className='text-xs font-bold uppercase text-slate-400'>Apellido</label>
                    <input
                        type="text" name="apellido"
                        className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500"
                        onChange={handleChange} required
                    />
                </div>

                <div>
                    <label className='text-xs font-bold uppercase text-slate-400'>Cargo</label>
                    <select
                        name="cargo"
                        className='w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500'
                        onChange={handleChange} 
                    >
                        <option value="Mecanico">Mecánico</option>
                        <option value="Tecnico">Técnico</option>
                        <option value="Supervisor">Supervisor</option>
                    </select>
                </div>

                <button tuype="submit" className='bg-pink-600 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-pink-700 transition-all shadow-lg shadow-pink-200'>
                    Guardar Empleado
                </button>
            </form>
        </div>
    );
};