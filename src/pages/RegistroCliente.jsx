import '../assets/recepcion.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/axios.js';

const FORM_INICIAL = {
    cedula_rif: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    correo: ''
};

export const RegistroCliente = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(FORM_INICIAL);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null); // { tipo: 'ok' | 'error', mensaje: '' }

    const handListaClientes = () => {
        navigate('/panel/Listado-Clientes');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiar feedback al editar
        if (feedback) setFeedback(null);
    };

    const handleGuardar = async () => {
        setFeedback(null);
        setLoading(true);

        try {
            // POST /api/clientes → { success, message, data: { ... } }
            await api.post('/clientes', formData);

            setFeedback({ tipo: 'ok', mensaje: '¡Cliente registrado con éxito!' });
            setFormData(FORM_INICIAL);

        } catch (err) {
            // Errores de validación 400 con array errors[].msg
            if (err.response?.status === 400 && err.response.data?.errors) {
                const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                setFeedback({ tipo: 'error', mensaje: msgs });
            } else {
                setFeedback({
                    tipo: 'error',
                    mensaje: err.response?.data?.error || 'No se pudo guardar el cliente'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-formulario" style={{ backgroundColor: '#F8FAFC', padding: '20px' }}>
            <div className="botones-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    className="btn-1"
                    onClick={handListaClientes}
                    style={{ backgroundColor: '#1E293B', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    Ver Listado de Clientes
                </button>
            </div>

            <h2 style={{ color: '#1E293B', fontWeight: 'bold', marginBottom: '20px' }}>Registro de Cliente</h2>

            {/* ── Feedback de operación ── */}
            {feedback && (
                <div style={{
                    backgroundColor: feedback.tipo === 'ok' ? '#D1FAE5' : '#FEE2E2',
                    color: feedback.tipo === 'ok' ? '#065F46' : '#991B1B',
                    border: `1px solid ${feedback.tipo === 'ok' ? '#6EE7B7' : '#FCA5A5'}`,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontWeight: '600',
                    fontSize: '14px'
                }}>
                    {feedback.mensaje}
                </div>
            )}

            <div className="formularios" style={{ display: 'flex', justifyContent: 'center' }}>

                {/*FORMULARIO DE REGISTRO DE CLIENTE*/}
                <div className="form-cliente" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', width: '100%', maxWidth: '600px' }}>
                    <h3 style={{ color: '#F43F5E', marginBottom: '15px' }}>Datos personales</h3>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Cédula o RIF:</label>
                        <input type="text" name="cedula_rif" value={formData.cedula_rif} onChange={handleChange} placeholder="123456789" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Nombre:</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ingrese nombre" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Apellido:</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ingrese apellido" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Teléfono:</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="04123456789" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Dirección:</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Av. 1 entre calles 2 y 3" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo">
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Correo:</label>
                        <input type="text" name="correo" value={formData.correo} onChange={handleChange} placeholder="ejemplo@gmail.com" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>
                </div>
            </div>

            {/*BOTONES PRINCIPALES*/}
            <div className="botones-container" style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
                <button
                    onClick={handleGuardar}
                    disabled={loading}
                    className="btn-1"
                    style={{ backgroundColor: loading ? '#6EE7B7' : '#10B981', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer' }}
                >
                    {loading ? 'Guardando...' : 'Guardar Cliente'}
                </button>
                <button
                    onClick={() => { setFormData(FORM_INICIAL); setFeedback(null); }}
                    className="btn-limpiar"
                    style={{ backgroundColor: '#EF4444', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Limpiar Formulario
                </button>
            </div>
        </div>
    );
};
