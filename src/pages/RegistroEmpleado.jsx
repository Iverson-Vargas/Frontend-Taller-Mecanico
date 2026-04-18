import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegistroEmpleado = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_empleado: "",
        nombre: "",
        apellido: "",
        cargo: "",
        telefono: "",
        sueldo_base: 0,
        monto_comision_fija: 0
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Asegurar conversiones correctas para la api
            const bodyData = {
                ...formData,
                sueldo_base: parseFloat(formData.sueldo_base),
                monto_comision_fija: parseFloat(formData.monto_comision_fija),
                aplica_comision: parseFloat(formData.monto_comision_fija) > 0
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/empleados`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if(response.ok) {
                alert(`¡Empleado ${formData.nombre} registrado con éxito!`);
                navigate('/panel/GestionEmpleados');
            } else {
                const errorData = await response.json();
                alert(`Error al registrar: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl mt-10 border border-slate-100">
            <h2 className="text-3xl font-black text-slate-main mb-2">
                Registro de Nuevo <span className='text-pink-accent'>Empleado</span>
            </h2>
            <p className="text-sm font-medium text-slate-400 mb-8">Completa el formulario para ingresar un especialista y asignarle salario o comisiones.</p>

            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {/* ID / Cédula */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Cédula / Documento (ID)</label>
                    <input type="text" name="id_empleado"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="V-12345678"
                        onChange={handleChange} required value={formData.id_empleado}
                    />
                </div>

                {/* Nombre */}
                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Nombre</label>
                    <input type="text" name="nombre"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="Juan"
                        onChange={handleChange} required value={formData.nombre}
                    />
                </div>

                {/* Apellido */}
                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Apellido</label>
                    <input type="text" name="apellido"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="Pérez"
                        onChange={handleChange} required value={formData.apellido}
                    />
                </div>

                {/* Especialidad Buscable con Datalist */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Especialidad / Cargo en Taller</label>
                    <input list="especialidades-list" name="cargo"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="Ej. Mecánico de Motor... (Escribe o Selecciona)"
                        autoComplete="off"
                        onChange={handleChange} required value={formData.cargo}
                    />
                    <datalist id="especialidades-list">
                        <option value="Mecánico General" />
                        <option value="Técnico Especialista en Motor" />
                        <option value="Especialista en Frenos y Suspensión" />
                        <option value="Electricidad Automotriz" />
                        <option value="Técnico en Transmisiones" />
                        <option value="Latonería y Pintura" />
                        <option value="Supervisor de Patio" />
                        <option value="Atención al Cliente / Recepción" />
                    </datalist>
                </div>

                {/* Salario */}
                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Sueldo Base ($)</label>
                    <input type="number" step="0.01" name="sueldo_base"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="0.00"
                        onChange={handleChange} required value={formData.sueldo_base}
                    />
                </div>

                {/* Comision Fija */}
                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Comisión por OS (% o $)</label>
                    <input type="number" step="0.01" name="monto_comision_fija"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="0.00"
                        onChange={handleChange} required value={formData.monto_comision_fija}
                    />
                </div>

                <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={loading}
                        className='w-full bg-pink-accent text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50'>
                        {loading ? 'Guardando...' : 'Reclutar y Guardar Empleado'}
                    </button>
                </div>
            </form>
        </div>
    );
};