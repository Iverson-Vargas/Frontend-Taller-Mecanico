import { useState } from 'react';
import '../assets/recepcion.css';
import api from '../services/axios.js';

const FORM_INICIAL = {
    cedula_rif: '',
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    kilometraje: '',
    capacidad_tanque: ''
};

export const RegistroVehiculo = () => {
    const [formData, setFormData] = useState(FORM_INICIAL);
    const [clienteEncontrado, setClienteEncontrado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [feedback, setFeedback] = useState(null); // { tipo: 'ok' | 'error' | 'info', mensaje: '' }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBuscarCliente = async () => {
        const cedula = formData.cedula_rif.trim();
        if (!cedula) {
            setFeedback({ tipo: 'error', mensaje: 'Ingrese la cédula del cliente' });
            return;
        }

        setFeedback(null);
        setClienteEncontrado(null);
        setCargando(true);

        try {
            // GET /api/clientes/consulta/:cedula → { success, message, data: { cliente: { ... } } }
            const res = await api.get(`/clientes/consulta/${cedula}`);
            const cliente = res.data.data.cliente || res.data.data;

            setClienteEncontrado(cliente);
            setFeedback({
                tipo: 'info',
                mensaje: `Cliente encontrado: ${cliente.nombre} ${cliente.apellido ?? ''}`
            });

        } catch (err) {
            setFeedback({
                tipo: 'error',
                mensaje: err.response?.data?.error || 'Cliente no encontrado. Debe registrarlo primero.'
            });
        } finally {
            setCargando(false);
        }
    };

    const normalizarPlaca = (placa) => {
        return placa.replace(/[-]/g, '').replace(/\s/g, '').toUpperCase();
    };

    const handleGuardar = async () => {
        if (!clienteEncontrado) {
            setFeedback({ tipo: 'error', mensaje: 'Debe buscar un cliente existente primero' });
            return;
        }
        if (!formData.placa) {
            setFeedback({ tipo: 'error', mensaje: 'La placa es obligatoria' });
            return;
        }

        setFeedback(null);
        setCargando(true);

        try {
            // POST /api/carros → { success, message, data: { ... } }
            // Solo enviar los campos que existen en el modelo Carro (snake_case)
            const vehiculoData = {
                placa: normalizarPlaca(formData.placa),
                marca: formData.marca || '',
                modelo: formData.modelo || '',
                ano: formData.ano ? parseInt(formData.ano) : null,
                kilometraje: formData.kilometraje ? parseInt(formData.kilometraje) : null,
                capacidad_tanque: formData.capacidad_tanque || '',
                id_cliente: clienteEncontrado.id_cliente   // ← Solo id_cliente, no cedula_rif
            };

            await api.post('/carros', vehiculoData);

            setFeedback({ tipo: 'ok', mensaje: 'Vehículo registrado exitosamente' });
            setFormData(FORM_INICIAL);
            setClienteEncontrado(null);

        } catch (err) {
            // Errores de validación 400 con array errors[].msg
            if (err.response?.status === 400 && err.response.data?.errors) {
                const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                setFeedback({ tipo: 'error', mensaje: msgs });
            } else {
                setFeedback({
                    tipo: 'error',
                    mensaje: err.response?.data?.error || 'Error al guardar el vehículo'
                });
            }
        } finally {
            setCargando(false);
        }
    };

    // Colores según tipo de feedback
    const feedbackStyles = {
        ok:    { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
        error: { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' },
        info:  { bg: '#E0F2FE', color: '#0C4A6E', border: '#7DD3FC' }
    };

    return (
        <div className="container-formulario">
            <div className="form-cliente" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3>Registro de Vehículo</h3>

                {/* ── Feedback de operación ── */}
                {feedback && (() => {
                    const s = feedbackStyles[feedback.tipo];
                    return (
                        <div style={{
                            backgroundColor: s.bg,
                            color: s.color,
                            border: `1px solid ${s.border}`,
                            padding: '10px 16px',
                            borderRadius: '8px',
                            marginBottom: '14px',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            {feedback.mensaje}
                        </div>
                    );
                })()}

                <div className="campo">
                    <label>Cédula del Cliente:*</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            name="cedula_rif"
                            value={formData.cedula_rif}
                            onChange={handleChange}
                            placeholder="Ingrese cédula del cliente"
                        />
                        <button
                            className="btn-1"
                            onClick={handleBuscarCliente}
                            disabled={cargando}
                            style={{ margin: 0, whiteSpace: 'nowrap' }}
                        >
                            {cargando ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                {clienteEncontrado && (
                    <div className="campo">
                        <div style={{ backgroundColor: '#E0F2FE', padding: '10px', borderRadius: '6px', marginTop: '5px' }}>
                            <strong>Cliente:</strong> {clienteEncontrado.nombre} {clienteEncontrado.apellido}<br />
                            <strong>Teléfono:</strong> {clienteEncontrado.telefono}<br />
                            <strong>ID Cliente:</strong> {clienteEncontrado.id_cliente}
                        </div>
                    </div>
                )}

                <div className="campo">
                    <label>Placa:*</label>
                    <input
                        type="text"
                        name="placa"
                        value={formData.placa}
                        onChange={handleChange}
                        placeholder="Ej: BBL32X"
                    />
                </div>

                <div className="campo">
                    <label>Marca:</label>
                    <input
                        type="text"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        placeholder="Ej: Renault"
                    />
                </div>

                <div className="campo">
                    <label>Modelo:</label>
                    <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        placeholder="Ej: Celio"
                    />
                </div>

                <div className="campo">
                    <label>Año:</label>
                    <input
                        type="number"
                        name="ano"
                        value={formData.ano}
                        onChange={handleChange}
                        placeholder="Ej: 2015"
                    />
                </div>

                <div className="campo">
                    <label>Kilometraje:</label>
                    <input
                        type="number"
                        name="kilometraje"
                        value={formData.kilometraje}
                        onChange={handleChange}
                        placeholder="Ej: 1000"
                    />
                </div>

                <div className="campo">
                    <label>Capacidad del tanque:</label>
                    <input
                        type="text"
                        name="capacidad_tanque"
                        value={formData.capacidad_tanque}
                        onChange={handleChange}
                        placeholder="Ej: 20 litros"
                    />
                </div>

                <div className="botones-container" style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <button
                        className="btn-guardar"
                        onClick={handleGuardar}
                        disabled={cargando || !clienteEncontrado}
                    >
                        {cargando ? 'Guardando...' : 'Registrar Vehículo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

