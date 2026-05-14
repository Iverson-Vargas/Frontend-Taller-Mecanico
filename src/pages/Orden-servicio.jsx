import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/orden-servicio.css';
import api from '../services/axios.js';

// ── Estados iniciales ────────────────────────────────────────────────────────
const FORM_INICIAL = {
    placa_carro: '',
    id_mecanico: null,
    motivo_visita: '',
    falla_declarada: '',
    tiene_caucho: false,
    tiene_radio: false,
    tiene_rayones: false,
    observaciones: '',
    estado: 'recepcion',
    prioridad: 'normal',
    diagnostico_tecnico: ''
};

const CLIENTE_INICIAL = { cedula: '', nombre: '', apellido: '', telefono: '' };
const VEHICULO_INICIAL = { placa: '', marca: '', modelo: '', ano: '', kilometraje: '' };

export const OrdenServicio = () => {
    const navigate = useNavigate();

    const [mecanicos, setMecanicos]               = useState([]);
    const [repuestos, setRepuestos]               = useState([]);
    const [loading, setLoading]                   = useState(false);
    const [formData, setFormData]                 = useState(FORM_INICIAL);
    const [clienteData, setClienteData]           = useState(CLIENTE_INICIAL);
    const [vehiculoData, setVehiculoData]         = useState(VEHICULO_INICIAL);
    const [vehiculosCliente, setVehiculosCliente] = useState([]);
    const [feedback, setFeedback]                 = useState(null); // { tipo: 'ok'|'error'|'info', mensaje: '' }

    useEffect(() => {
        cargarMecanicos();
        cargarRepuestos();
    }, []);

    // ── Carga inicial ────────────────────────────────────────────────────────

    const cargarMecanicos = async () => {
        try {
            // GET /api/empleados
            const res = await api.get('/empleados');
            const dataPayload = res.data.data;
            
            let mecanicosArray = [];
            if (Array.isArray(dataPayload)) mecanicosArray = dataPayload;
            else if (dataPayload && Array.isArray(dataPayload.empleados)) mecanicosArray = dataPayload.empleados;

            setMecanicos(mecanicosArray);
        } catch (error) {
            console.error('Error cargando mecánicos:', error);
            setMecanicos([]);
        }
    };

    const cargarRepuestos = async () => {
        try {
            // GET /api/inventario
            const res = await api.get('/inventario');
            const dataPayload = res.data.data;

            let repuestosArray = [];
            if (Array.isArray(dataPayload)) repuestosArray = dataPayload;
            else if (dataPayload && Array.isArray(dataPayload.repuestos)) repuestosArray = dataPayload.repuestos;

            setRepuestos(repuestosArray);
        } catch (error) {
            console.error('Error cargando repuestos:', error);
            setRepuestos([]);
        }
    };

    // ── Búsqueda de cliente y vehículos ─────────────────────────────────────

    const handleBuscarCliente = async () => {
        const cedula = clienteData.cedula.trim();
        if (!cedula) {
            setFeedback({ tipo: 'error', mensaje: 'Ingrese una cédula para buscar' });
            return;
        }

        setFeedback(null);
        setLoading(true);

        try {
            // 1. GET /api/clientes/consulta/:cedula → { success, message, data: { cliente: { ... } } }
            const resCliente = await api.get(`/clientes/consulta/${cedula}`);
            const cliente = resCliente.data.data.cliente || resCliente.data.data;

            setClienteData({
                cedula: cliente.cedula_rif || cedula,
                nombre: cliente.nombre     || '',
                apellido: cliente.apellido || '',
                telefono: cliente.telefono || ''
            });

            // 2. GET /api/carros/cliente/:cedula → { success, message, data: [ ... ] }
            try {
                const resVehiculos = await api.get(`/carros/cliente/${cedula}`);
                const vehiculos = resVehiculos.data.data ?? [];

                if (vehiculos.length > 0) {
                    setVehiculosCliente(vehiculos);
                    const v = vehiculos[0];
                    setVehiculoData({
                        placa: v.placa        || '',
                        marca: v.marca        || '',
                        modelo: v.modelo      || '',
                        ano: v.ano            || '',
                        kilometraje: v.kilometraje || ''
                    });
                    setFormData(prev => ({ ...prev, placa_carro: v.placa }));
                    setFeedback({
                        tipo: 'info',
                        mensaje: `Cliente: ${cliente.nombre} ${cliente.apellido || ''} — ${vehiculos.length} vehículo(s) encontrado(s)`
                    });
                } else {
                    setVehiculosCliente([]);
                    setVehiculoData(VEHICULO_INICIAL);
                    setFeedback({
                        tipo: 'info',
                        mensaje: `Cliente encontrado: ${cliente.nombre} — Sin vehículos registrados`
                    });
                }
            } catch {
                setFeedback({
                    tipo: 'info',
                    mensaje: `Cliente encontrado: ${cliente.nombre} — No se pudieron cargar sus vehículos`
                });
            }

        } catch (err) {
            limpiarDatosCliente();
            setFeedback({
                tipo: 'error',
                mensaje: err.response?.data?.error || 'Cliente no encontrado. Debe registrarlo primero.'
            });
        } finally {
            setLoading(false);
        }
    };

    const limpiarDatosCliente = () => {
        setClienteData(CLIENTE_INICIAL);
        setVehiculoData(VEHICULO_INICIAL);
        setVehiculosCliente([]);
        setFormData(prev => ({ ...prev, placa_carro: '' }));
    };

    const handleSeleccionarVehiculo = (e) => {
        const placaSeleccionada = e.target.value;
        const vehiculo = vehiculosCliente.find(v => v.placa === placaSeleccionada);
        if (vehiculo) {
            setVehiculoData({
                placa: vehiculo.placa         || '',
                marca: vehiculo.marca         || '',
                modelo: vehiculo.modelo       || '',
                ano: vehiculo.ano             || '',
                kilometraje: vehiculo.kilometraje || ''
            });
            setFormData(prev => ({ ...prev, placa_carro: vehiculo.placa }));
        }
    };

    // ── Handlers de formulario ───────────────────────────────────────────────

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleClienteInputChange = (e) => {
        const { name, value } = e.target;
        setClienteData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        handleGuardarOrden();
    };

    // ── Guardar orden ────────────────────────────────────────────────────────

    const handleGuardarOrden = async () => {
        if (!formData.placa_carro) {
            setFeedback({ tipo: 'error', mensaje: 'Debe buscar un cliente con vehículo primero' });
            return;
        }
        if (!formData.falla_declarada) {
            setFeedback({ tipo: 'error', mensaje: 'La falla declarada es requerida' });
            return;
        }

        setFeedback(null);
        setLoading(true);

        try {
            // POST /api/ordenes → { success, message, data: { id_orden, ... } }
            const ordenData = {
                placa_carro:         formData.placa_carro,
                id_mecanico:         formData.id_mecanico  ? parseInt(formData.id_mecanico) : null,
                motivo_visita:       formData.motivo_visita       || null,
                falla_declarada:     formData.falla_declarada,
                tiene_caucho:        formData.tiene_caucho,
                tiene_radio:         formData.tiene_radio,
                tiene_rayones:       formData.tiene_rayones,
                observaciones:       formData.observaciones       || null,
                diagnostico_tecnico: formData.diagnostico_tecnico || null,
                estado:              formData.estado
            };

            const res = await api.post('/ordenes', ordenData);
            const ordenCreada = res.data.data;

            // Limpiar todo
            setFormData(FORM_INICIAL);
            setClienteData(CLIENTE_INICIAL);
            setVehiculoData(VEHICULO_INICIAL);
            setVehiculosCliente([]);

            setFeedback({
                tipo: 'ok',
                mensaje: `Orden #${ordenCreada?.id_orden ?? '—'} guardada exitosamente`
            });

            setTimeout(() => navigate('/panel/Lista-Servicio'), 1500);

        } catch (err) {
            // Errores de validación 400 con array errors[].msg
            if (err.response?.status === 400 && err.response.data?.errors) {
                const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                setFeedback({ tipo: 'error', mensaje: msgs });
            } else {
                setFeedback({
                    tipo: 'error',
                    mensaje: err.response?.data?.error || 'Error al guardar la orden'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handListaServicio = () => navigate('/panel/Lista-Servicio');
    const handListaClientes = () => navigate('/panel/Listado-Clientes');

    // ── Estilos de feedback ──────────────────────────────────────────────────
    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' },
        info:  { backgroundColor: '#E0F2FE', color: '#0C4A6E', border: '1px solid #7DD3FC' }
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <form className="orden-container" onSubmit={handleSubmit}>
            <div className="botones">
                <button type="button" className="btn-2" onClick={handListaServicio}>
                    Listado de servicios
                </button>
                <button type="button" className="btn-2" onClick={handListaClientes}>
                    Listado de clientes
                </button>
            </div>

            <h1 className="titulo-principal">NUEVA ORDEN DE SERVICIO</h1>

            {/* ── Feedback de operación ── */}
            {feedback && (
                <div style={{
                    ...feedbackStyles[feedback.tipo],
                    padding: '10px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontWeight: '600',
                    fontSize: '14px'
                }}>
                    {feedback.mensaje}
                </div>
            )}

            {/* ── Encabezado de orden ── */}
            <div className="encabezado-orden">
                <div className="numero-orden">
                    <label>N° de Orden:</label>
                    <input type="text" className="campo-lectura" placeholder="Automático" readOnly />
                </div>
                <div className="fecha-hora">
                    <div className="campo">
                        <label>Fecha de ingreso:</label>
                        <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="campo">
                        <label>Hora de ingreso:</label>
                        <input type="time" defaultValue={new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} />
                    </div>
                </div>
                <div className="campo">
                    <label>Estado de la orden:</label>
                    <select name="estado" value={formData.estado} onChange={handleInputChange}>
                        <option value="recepcion">Recepción</option>
                        <option value="en_espera">En espera</option>
                        <option value="en_reparacion">En reparación</option>
                        <option value="esperando_repuestos">Esperando repuestos</option>
                        <option value="finalizada">Finalizada</option>
                        <option value="facturada">Facturada</option>
                        <option value="entregada">Entregada</option>
                    </select>
                </div>
                <div className="campo">
                    <label>Mecánico asignado:</label>
                    <select name="id_mecanico" value={formData.id_mecanico || ''} onChange={handleInputChange}>
                        <option value="">Seleccione</option>
                        {Array.isArray(mecanicos) && mecanicos.map(mec => (
                            <option key={mec.id_empleado} value={mec.id_empleado}>
                                {mec.nombre} {mec.apellido} - {mec.cargo}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Datos del cliente ── */}
            <h2 className="subtitulo">DATOS DEL CLIENTE</h2>
            <div className="seccion-grid">
                <div className="campo">
                    <label>Cédula:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            name="cedula"
                            value={clienteData.cedula}
                            onChange={handleClienteInputChange}
                            placeholder="Ingrese cédula (ej: 1234567)"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={handleBuscarCliente}
                            disabled={loading}
                            style={{ padding: '5px 15px', cursor: 'pointer' }}
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>
                <div className="campo">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={clienteData.nombre
                            ? `${clienteData.nombre} ${clienteData.apellido}`.trim()
                            : ''}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
                <div className="campo">
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        value={clienteData.telefono}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
            </div>

            {/* ── Datos del vehículo ── */}
            <h2 className="subtitulo">DATOS DEL VEHÍCULO</h2>

            {vehiculosCliente.length > 1 && (
                <div className="campo" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                        Seleccionar Vehículo:
                    </label>
                    <select
                        onChange={handleSeleccionarVehiculo}
                        value={vehiculoData.placa}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
                    >
                        {vehiculosCliente.map(v => (
                            <option key={v.placa} value={v.placa}>
                                {v.placa} - {v.marca} {v.modelo}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="seccion-grid">
                <div className="campo">
                    <label>Placa:</label>
                    <input type="text" value={vehiculoData.placa} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>
                <div className="campo">
                    <label>Marca:</label>
                    <input type="text" value={vehiculoData.marca} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>
                <div className="campo">
                    <label>Modelo:</label>
                    <input type="text" value={vehiculoData.modelo} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>
                <div className="campo">
                    <label>Año:</label>
                    <input type="text" value={vehiculoData.ano} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>
                <div className="campo">
                    <label>Kilometraje actual:</label>
                    <input type="text" value={vehiculoData.kilometraje} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>
            </div>

            {/* ── Diagnóstico inicial ── */}
            <h2 className="subtitulo">DIAGNÓSTICO INICIAL</h2>
            <div className="diagnostico-inicial">
                <div className="campo">
                    <label>Motivo de visita:</label>
                    <textarea name="motivo_visita" value={formData.motivo_visita} onChange={handleInputChange} rows="2"></textarea>
                </div>

                <h3 className="subtitulo-secundario">INVENTARIO INICIAL</h3>
                <div className="checkboxes-grid">
                    <div className="checkbox-item">
                        <input type="checkbox" name="tiene_caucho" checked={formData.tiene_caucho} onChange={handleInputChange} id="caucho" />
                        <label htmlFor="caucho">¿Caucho de repuesto?</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" name="tiene_radio" checked={formData.tiene_radio} onChange={handleInputChange} id="radio" />
                        <label htmlFor="radio">¿Radio?</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" name="tiene_rayones" checked={formData.tiene_rayones} onChange={handleInputChange} id="rayones" />
                        <label htmlFor="rayones">¿Rayones previos?</label>
                    </div>
                </div>

                <div className="campo">
                    <label>Fallas declaradas (descripción):</label>
                    <textarea name="falla_declarada" value={formData.falla_declarada} onChange={handleInputChange} rows="3"></textarea>
                </div>
            </div>

            {/* ── Diagnóstico técnico ── */}
            <h2 className="subtitulo">DIAGNÓSTICO TÉCNICO</h2>
            <div className="diagnostico-tecnico">
                <div className="campo">
                    <label>Diagnóstico:</label>
                    <textarea name="diagnostico_tecnico" value={formData.diagnostico_tecnico} onChange={handleInputChange} rows="3"></textarea>
                </div>
                <div className="campo">
                    <label>Observaciones:</label>
                    <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows="3"></textarea>
                </div>
            </div>

            {/* ── Servicio ── */}
            <h2 className="subtitulo">SERVICIO</h2>
            <div className="servicio-grid">
                <div className="campo">
                    <label>Tipo de servicio:</label>
                    <select>
                        <option value="">Seleccione</option>
                        <option>Mantenimiento preventivo</option>
                        <option>Reparación mecánica</option>
                    </select>
                </div>
                <div className="campo">
                    <label>Prioridad:</label>
                    <select name="prioridad" value={formData.prioridad} onChange={handleInputChange}>
                        <option value="baja">Baja</option>
                        <option value="normal">Normal</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                    </select>
                </div>
            </div>

            {/* ── Repuestos ── */}
            <div className="repuestos-seccion">
                <div className="checkbox-item">
                    <input type="checkbox" id="repuesto" />
                    <label htmlFor="repuesto">¿Requiere repuesto?</label>
                </div>
                <div className="campo">
                    <label>Repuesto en inventario:</label>
                    <select>
                        <option value="">Seleccione un repuesto</option>
                        {Array.isArray(repuestos) && repuestos.map(rep => (
                            <option key={rep.id_inventario} value={rep.id_inventario}>
                                {rep.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Costos ── */}
            <div className="diagnostico-tecnico mt-4">
                <div className="campo">
                    <label>Costo ($):</label>
                    <input type="text" className="campo-lectura" readOnly />
                </div>
                <div className="mano-obra">
                    <div className="checkbox-item">
                        <input type="checkbox" id="manoObra" />
                        <label htmlFor="manoObra">¿Mano de obra especial?</label>
                    </div>
                    <div className="campo">
                        <label>Costo mano de obra ($):</label>
                        <input type="text" />
                    </div>
                </div>
                <div className="campo subtotal">
                    <label>Subtotal ($):</label>
                    <input type="text" className="campo-lectura campo-destacado" readOnly />
                </div>
            </div>

            {/* ── Acciones ── */}
            <div className="botones-accion">
                <button className="btn-imprimir" type="button">Imprimir Orden</button>
                <button
                    className="btn-guardar"
                    type="button"
                    onClick={handleGuardarOrden}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Orden'}
                </button>
            </div>
        </form>
    );
};
