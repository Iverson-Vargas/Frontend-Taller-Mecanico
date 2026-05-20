import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/axios.js';

export const EditarEmpleado = () => {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [feedback, setFeedback] = useState(null); // { tipo: 'ok'|'error', mensaje: '' }

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

    useEffect(() => {
        const fetchEmpleado = async () => {
            try {
                // GET /api/empleados/:id
                const response = await api.get(`/empleados/${id}`);
                const emp = response.data.data.empleado || response.data.data;
                
                if (emp) {
                    setFormData({
                        id_empleado: emp.id_empleado || emp.cedula_rif || id,
                        nombre: emp.nombre || "",
                        apellido: emp.apellido || "",
                        cargo: emp.cargo || "",
                        telefono: emp.telefono || "",
                        sueldo_base: emp.sueldo_base || 0,
                        monto_comision_fija: emp.monto_comision_fija || 0
                    });
                } else {
                    setFeedback({ tipo: 'error', mensaje: "No se encontró el empleado." });
                    setTimeout(() => navigate('/panel/GestionEmpleados'), 2000);
                }
            } catch (error) {
                console.error("Error obteniendo empleado:", error);
                setFeedback({ tipo: 'error', mensaje: error.response?.data?.error || "Fallo al cargar datos del empleado." });
                setTimeout(() => navigate('/panel/GestionEmpleados'), 2500);
            } finally {
                setLoading(false);
            }
        };
        fetchEmpleado();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectEspecialidad = (esp) => {
        setFormData({ ...formData, cargo: esp });
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFeedback(null);
        try {
            const bodyData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                cargo: formData.cargo,
                telefono: formData.telefono,
                sueldo_base: parseFloat(formData.sueldo_base || 0),
                monto_comision_fija: parseFloat(formData.monto_comision_fija || 0),
                aplica_comision: parseFloat(formData.monto_comision_fija) > 0
            };

            // PUT /api/empleados/:id
            await api.put(`/empleados/${id}`, bodyData);

            setFeedback({ tipo: 'ok', mensaje: `¡Los datos de ${formData.nombre} fueron actualizados con éxito!` });
            setTimeout(() => navigate('/panel/GestionEmpleados'), 2000);

        } catch (err) {
            console.error("Error al actualizar empleado:", err);
            if (err.response?.status === 400 && err.response.data?.errors) {
                const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                setFeedback({ tipo: 'error', mensaje: msgs });
            } else {
                setFeedback({ tipo: 'error', mensaje: err.response?.data?.error || "No se pudo actualizar el empleado." });
            }
        } finally {
            setSaving(false);
        }
    };

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
    };

    if(loading) {
        return <div className="p-10 text-center font-bold text-slate-400">Cargando datos del empleado...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl mt-10 border border-slate-100 relative">
            <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 hover:text-pink-accent font-bold text-sm transition-colors cursor-pointer"
                title="Volver atrás"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Cancelar Edición
            </button>

            <h2 className="text-3xl font-black text-slate-main mb-2">
                Editar Datos de <span className='text-pink-accent'>{formData.nombre}</span>
            </h2>
            <p className="text-sm font-medium text-slate-400 mb-6">Modifica la información y actualiza el expediente del empleado.</p>

            {/* FEEDBACK */}
            {feedback && (
                <div style={{
                    ...feedbackStyles[feedback.tipo],
                    padding: '12px 20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    {feedback.mensaje}
                </div>
            )}

            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Cédula / Documento (No modificable)</label>
                    <input type="text" name="id_empleado"
                        className="w-full p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-400 outline-none cursor-not-allowed font-medium"
                        disabled
                        value={formData.id_empleado}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Nombre</label>
                    <input type="text" name="nombre"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all font-medium text-slate-700"
                        placeholder="Juan"
                        onChange={handleChange} required value={formData.nombre}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Apellido</label>
                    <input type="text" name="apellido"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all font-medium text-slate-700"
                        placeholder="Pérez"
                        onChange={handleChange} required value={formData.apellido}
                    />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2 relative">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Especialidad / Cargo en Taller</label>
                    <input type="text" name="cargo"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all font-medium text-slate-700"
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
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all font-medium text-slate-700"
                        onChange={handleChange} required value={formData.sueldo_base}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>Comisión por OS (% o $)</label>
                    <input type="number" step="0.01" name="monto_comision_fija"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-accent outline-none transition-all font-medium text-slate-700"
                        onChange={handleChange} required value={formData.monto_comision_fija}
                    />
                </div>

                <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={saving}
                        className='cursor-pointer w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50'>
                        {saving ? 'Aplicando Cambios...' : 'Guardar y Actualizar Empleado'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarEmpleado;
