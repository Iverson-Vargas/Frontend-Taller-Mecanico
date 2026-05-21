import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios.js';

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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const mostrarFeedback = (mensaje, tipo = "ok") => {
        setFeedback({ visible: true, mensaje, tipo });
        setTimeout(() => setFeedback(null), 4500);
    };

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
    };

    const especialidadesDisponibles = [
        "Mecánico General",
        "Técnico Especialista en Motor",
        "Especialista en Frenos y Suspensión",
        "Electricidad Automotriz",
        "Técnico en Transmisiones",
        "Latonería y Pintura",
        "Supervisor de Patio",
        "Atención al Cliente / Recepción"
    ];

    const filteredEspecialidades = especialidadesDisponibles.filter(esp => 
        esp.toLowerCase().includes((formData.cargo || '').toLowerCase())
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectEspecialidad = (esp) => {
        setFormData({ ...formData, cargo: esp });
        setShowSuggestions(false);
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

            const response = await api.post('/empleados', bodyData);
            
            // Si el backend sigue el estándar { success: true, message, data }
            const resData = response.data;
            
            mostrarFeedback(`¡Empleado ${formData.nombre} registrado con éxito!`, "ok");
            
            // Redirigir después de un momento para que vean el mensaje
            setTimeout(() => {
                navigate('/panel/GestionEmpleados');
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || "No se pudo conectar con el servidor.";
            mostrarFeedback(`Error al registrar: ${errorMsg}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl mt-10 border border-slate-100 relative">
            
            {/* Toast Notificación */}
            {feedback && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-[200]`} style={feedbackStyles[feedback.tipo]}>
                    <p className="font-bold text-sm tracking-wide">{feedback.mensaje}</p>
                </div>
            )}


            <h2 className="text-3xl font-black text-slate-main mb-2">
                Registro de Nuevo <span className='text-pink-accent'>Empleado</span>
            </h2>
            <p className="text-sm font-medium text-slate-400 mb-8">Completa el formulario para ingresar un especialista y asignarle salario o comisiones.</p>

            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Cédula / Documento (ID)</label>
                    <input type="text" name="id_empleado"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="V-12345678"
                        onChange={handleChange} required value={formData.id_empleado}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Nombre</label>
                    <input type="text" name="nombre"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="Juan"
                        onChange={handleChange} required value={formData.nombre}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Apellido</label>
                    <input type="text" name="apellido"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="Pérez"
                        onChange={handleChange} required value={formData.apellido}
                    />
                </div>

                {/* Autocomplete Custom */}
                <div className="flex flex-col gap-1 md:col-span-2 relative">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Especialidad / Cargo en Taller</label>
                    <input type="text" name="cargo"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="Ej. Mecánico de Motor... (Escribe o Selecciona)"
                        autoComplete="off"
                        onChange={handleChange} 
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        required value={formData.cargo}
                    />
                    {showSuggestions && filteredEspecialidades.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-slate-200 shadow-xl max-h-48 overflow-y-auto rounded-xl top-[75px] mt-1 py-2">
                            {filteredEspecialidades.map((esp, i) => (
                                <li 
                                    key={i} 
                                    className="px-4 py-2 hover:bg-rose-50 hover:text-pink-accent cursor-pointer transition-colors text-sm text-slate-600 font-medium"
                                    onMouseDown={() => handleSelectEspecialidad(esp)}
                                >
                                    {esp}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Sueldo Base ($)</label>
                    <input type="number" step="0.01" name="sueldo_base"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all"
                        placeholder="0.00"
                        onChange={handleChange} required value={formData.sueldo_base}
                    />
                </div>

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
