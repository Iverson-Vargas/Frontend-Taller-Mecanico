import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/orden-servicio.css';
import api from '../services/axios.js';

// ÔöÇÔöÇ Estados iniciales ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
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
    const { id } = useParams();

    const [mecanicos, setMecanicos]               = useState([]);
    const [repuestos, setRepuestos]               = useState([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
    const [servicioSeleccionadoId, setServicioSeleccionadoId] = useState('');
    const [servicioSeleccionadoEsEspecial, setServicioSeleccionadoEsEspecial] = useState(false);
    const [servicioSeleccionadoDescripcionEspecial, setServicioSeleccionadoDescripcionEspecial] = useState('');
    const [loading, setLoading]                   = useState(false);
    const [formData, setFormData]                 = useState(FORM_INICIAL);
    const [clienteData, setClienteData]           = useState(CLIENTE_INICIAL);
    const [vehiculoData, setVehiculoData]         = useState(VEHICULO_INICIAL);
    const [vehiculosCliente, setVehiculosCliente] = useState([]);
    const [feedback, setFeedback]                 = useState(null); // { tipo: 'ok'|'error'|'info', mensaje: '' }
    const [ordenCargada, setOrdenCargada]         = useState(false);
    const [ordenOriginal, setOrdenOriginal]       = useState(null);
    const [manoObra, setManoObra]                 = useState('0');
    const [repuestoCosto, setRepuestoCosto]       = useState('0');
    
    const usuarioStr = localStorage.getItem('usuario');
    const usuarioInfo = usuarioStr ? JSON.parse(usuarioStr) : null;
    const permisos = usuarioInfo?.permisos || {};
    
    // Fallback: si no tiene ningún permiso explícito, asume true (retrocompatibilidad)
    const hasAnyPermission = permisos.recepcion || permisos.mecanico || permisos.admin_caja || permisos.inventario;
    const tienePermisoRecepcion = !hasAnyPermission || permisos.recepcion || permisos.admin_caja;
    const tienePermisoMecanico = !hasAnyPermission || permisos.mecanico || permisos.admin_caja;
    const tienePermisoAdmin = !hasAnyPermission || permisos.admin_caja;

    const [vistaActiva, setVistaActiva]           = useState(tienePermisoRecepcion ? 'recepcion' : 'mecanico'); // 'recepcion' o 'mecanico'

    useEffect(() => {
        cargarMecanicos();
        cargarRepuestos();
        cargarServicios();
        if (id) {
            cargarOrden();
            if (tienePermisoMecanico) setVistaActiva('mecanico');
        }
    }, [id]);

    // ÔöÇÔöÇ Carga inicial ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

    const cargarServicios = async () => {
        try {
            const res = await api.get('/servicios');
            let servs = [];
            if (Array.isArray(res.data.data)) servs = res.data.data;
            else if (res.data.data && Array.isArray(res.data.data.servicios)) servs = res.data.data.servicios;
            setServiciosDisponibles(servs);
        } catch (error) {
            console.error('Error cargando servicios:', error);
        }
    };

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

    const cargarOrden = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/ordenes/${id}`);
            const orden = res.data.data.orden || res.data.data;
            setOrdenOriginal(orden || null);

            setFormData({
                placa_carro: orden.placa_carro || '',
                id_mecanico: orden.id_mecanico || null,
                motivo_visita: orden.motivo_visita || '',
                falla_declarada: orden.falla_declarada || '',
                tiene_caucho: !!orden.tiene_caucho,
                tiene_radio: !!orden.tiene_radio,
                tiene_rayones: !!orden.tiene_rayones,
                observaciones: orden.observaciones || '',
                estado: orden.estado || 'recepcion',
                prioridad: orden.prioridad || 'normal',
                diagnostico_tecnico: orden.diagnostico_tecnico || ''
            });

            setClienteData({
                cedula: orden.carro?.cliente?.cedula_rif || orden.carro?.cliente?.cedula || '',
                nombre: orden.carro?.cliente?.nombre || '',
                apellido: orden.carro?.cliente?.apellido || '',
                telefono: orden.carro?.cliente?.telefono || ''
            });

            setVehiculoData({
                placa: orden.placa_carro || '',
                marca: orden.carro?.marca || '',
                modelo: orden.carro?.modelo || '',
                ano: orden.carro?.ano || '',
                kilometraje: orden.carro?.kilometraje || ''
            });

            const serviciosOrden = (orden.detalles_servicios || orden.servicios || []).map((serv) => ({
                id_servicio: serv.id_servicio || serv.id || serv.servicio?.id_servicio || serv.servicio?.id,
                nombre_servicio: serv.servicio?.nombre_servicio || serv.nombre_servicio || serv.nombre || 'Servicio',
                precio_base: Number(serv.precio_aplicado || serv.precio_base || serv.servicio?.precio_base || serv.precio || 0),
                es_especial: Boolean(serv.es_especial),
                descripcion_especial: serv.descripcion_especial || ''
            }));

            setServiciosSeleccionados(serviciosOrden);
            setOrdenCargada(true);
        } catch (error) {
            console.error('Error cargando orden:', error);
            setFeedback({ tipo: 'error', mensaje: 'No se pudo cargar la orden seleccionada.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAgregarServicio = () => {
        const servicio = serviciosDisponibles.find(s => s.id_servicio == servicioSeleccionadoId);
        if (!servicio) {
            setFeedback({ tipo: 'error', mensaje: 'Seleccione un servicio válido.' });
            return;
        }

        if (serviciosSeleccionados.some(s => s.id_servicio == servicio.id_servicio)) {
            setFeedback({ tipo: 'info', mensaje: 'Este servicio ya fue agregado.' });
            return;
        }

        setServiciosSeleccionados([...serviciosSeleccionados, {
            id_servicio: servicio.id_servicio,
            nombre_servicio: servicio.nombre_servicio,
            precio_base: Number(servicio.precio_base || servicio.precio || 0),
            es_especial: servicioSeleccionadoEsEspecial,
            descripcion_especial: servicioSeleccionadoDescripcionEspecial
        }] );
        setServicioSeleccionadoId('');
        setServicioSeleccionadoEsEspecial(false);
        setServicioSeleccionadoDescripcionEspecial('');
    };

    const handleEliminarServicio = (idServicio) => {
        setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.id_servicio !== idServicio));
    };

    const getEstadoTexto = (estado) => {
        const estados = {
            recepcion: 'Recepción',
            en_espera: 'En espera',
            en_reparacion: 'En reparación',
            esperando_repuestos: 'Esperando repuestos',
            finalizada: 'Finalizada',
            facturada: 'Facturada',
            entregada: 'Entregada'
        };
        return estados[estado] || estado;
    };

    const estadoBadgeClass = (estado) => {
        return `tag-${estado}`;
    };

    const serviciosTotal = useMemo(() => {
        return serviciosSeleccionados.reduce((total, servicio) => total + Number(servicio.precio_base || 0), 0);
    }, [serviciosSeleccionados]);

    const manoObraTotal = Number(manoObra) || 0;
    const repuestoTotal = Number(repuestoCosto) || 0;
    const totalOrden = serviciosTotal + manoObraTotal + repuestoTotal;

    // ÔöÇÔöÇ B├║squeda de cliente y veh├¡culos ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

    const handleBuscarCliente = async () => {
        const cedula = clienteData.cedula.trim();
        if (!cedula) {
            setFeedback({ tipo: 'error', mensaje: 'Ingrese una cédula para buscar' });
            return;
        }

        setFeedback(null);
        setLoading(true);

        try {
            // 1. GET /api/clientes/consulta/:cedula ÔåÆ { success, message, data: { cliente: { ... } } }
            const resCliente = await api.get(`/clientes/consulta/${cedula}`);
            const cliente = resCliente.data.data.cliente || resCliente.data.data;

            setClienteData({
                cedula: cliente.cedula_rif || cedula,
                nombre: cliente.nombre     || '',
                apellido: cliente.apellido || '',
                telefono: cliente.telefono || ''
            });

            // Los vehículos ya vienen incluidos en la respuesta del cliente
            const vehiculos = cliente.carros || [];

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
                    tipo: 'ok',
                    mensaje: `Cliente: ${cliente.nombre} ${cliente.apellido || ''} — ${vehiculos.length} vehículo(s) cargados.`
                });
            } else {
                setVehiculosCliente([]);
                setVehiculoData(VEHICULO_INICIAL);
                setFeedback({
                    tipo: 'error',
                    mensaje: `Cliente encontrado: ${cliente.nombre}. PERO no tiene vehículos registrados. Por favor registre su vehículo primero en el menú lateral.`
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
        setServiciosSeleccionados([]);
        setServicioSeleccionadoId('');
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

    // ÔöÇÔöÇ Handlers de formulario ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

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

    // ÔöÇÔöÇ Guardar orden ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

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
            const ordenData = {
                placa_carro:         formData.placa_carro,
                id_mecanico:         formData.id_mecanico || null,
                motivo_visita:       formData.motivo_visita       || null,
                falla_declarada:     formData.falla_declarada,
                tiene_caucho:        formData.tiene_caucho,
                tiene_radio:         formData.tiene_radio,
                tiene_rayones:       formData.tiene_rayones,
                observaciones:       formData.observaciones       || null,
                diagnostico_tecnico: formData.diagnostico_tecnico || null,
                servicios:           serviciosSeleccionados,
                estado:              formData.estado,
                prioridad:           formData.prioridad           || 'normal'
            };

            const res = id ? await api.put(`/ordenes/${id}`, ordenData) : await api.post('/ordenes', ordenData);
            const ordenGuardada = res.data.data;

            // Limpiar solo si la orden se creó desde cero, en edición se mantiene para revisión
            if (!id) {
                setFormData(FORM_INICIAL);
                setClienteData(CLIENTE_INICIAL);
                setVehiculoData(VEHICULO_INICIAL);
                setVehiculosCliente([]);
                setServiciosSeleccionados([]);
                setServicioSeleccionadoId('');
                setServicioSeleccionadoEsEspecial(false);
                setServicioSeleccionadoDescripcionEspecial('');
            }

            setFeedback({
                tipo: 'ok',
                mensaje: id
                    ? `Orden #${ordenGuardada?.id_orden ?? id} actualizada exitosamente`
                    : `Orden #${ordenGuardada?.id_orden ?? '—'} guardada exitosamente`
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
    const handleImprimirOrden = () => {
        window.print();
    };

    // ÔöÇÔöÇ Estilos de feedback ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' },
        info:  { backgroundColor: '#E0F2FE', color: '#0C4A6E', border: '1px solid #7DD3FC' }
    };

    // ÔöÇÔöÇ Render ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

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
            {(ordenOriginal || id) && (
                <div className="orden-dashboard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                    <div>
                        <p className="texto-dashboard" style={{ marginBottom: '0.25rem', fontWeight: '700' }}>Orden #{ordenOriginal?.id_orden || id}</p>
                        <p className="texto-dashboard" style={{ color: '#64748b' }}>Cliente: {clienteData.nombre ? `${clienteData.nombre} ${clienteData.apellido}` : 'N/A'} • Placa: {vehiculoData.placa || 'N/A'}</p>
                    </div>
                    <span className={`tag-${formData.estado}`} style={{ padding: '10px 16px', borderRadius: '999px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {getEstadoTexto(formData.estado)}
                    </span>
                </div>
            )}

            {/* ÔöÇÔöÇ Tabs de Vista ÔöÇÔöÇ */}
            <div className="tabs-container">
                {tienePermisoRecepcion && (
                    <button
                        type="button"
                        className={`tab-btn ${vistaActiva === 'recepcion' ? 'active' : ''}`}
                        onClick={() => setVistaActiva('recepcion')}
                    >
                        Recepción (Diagnóstico Inicial)
                    </button>
                )}
                {tienePermisoMecanico && (
                    <button
                        type="button"
                        className={`tab-btn ${vistaActiva === 'mecanico' ? 'active' : ''}`}
                        onClick={() => setVistaActiva('mecanico')}
                    >
                        Mecánico (Diagnóstico Técnico y Servicio)
                    </button>
                )}
            </div>

            {/* ---- Feedback de operación ---- */}
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

            {/* ---- VISTA DE RECEPCIÓN ---- */}
            {vistaActiva === 'recepcion' && (
                <div className="vista-recepcion">
                    {/* ---- Encabezado de orden ---- */}
            <div className="encabezado-orden">
                <div className="numero-orden">
                    <label>Nº de Orden:</label>
                    <input
                        type="text"
                        className="campo-lectura"
                        placeholder="Automático"
                        value={ordenOriginal?.id_orden || ''}
                        readOnly
                    />
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
                        {tienePermisoAdmin && (
                            <>
                                <option value="facturada">Facturada</option>
                                <option value="entregada">Entregada</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="campo">
                    <label>Mecánico asignado:</label>
                    <select name="id_mecanico" value={formData.id_mecanico || ''} onChange={handleInputChange}>
                        <option value="">Seleccione</option>
                        {Array.isArray(mecanicos) && mecanicos.map((mec, index) => (
                            <option key={mec.id_empleado || index} value={mec.id_empleado}>
                                {mec.nombre} {mec.apellido} - {mec.cargo}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ---- Datos del cliente ---- */}
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

            {/* ---- Datos del vehículo ---- */}
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
                        {vehiculosCliente.map((v, index) => (
                            <option key={v.placa || index} value={v.placa}>
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

            {/* ---- Diagnóstico inicial ---- */}
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

                </div>
            )}

            {/* ---- VISTA DE MECÁNICO ---- */}
            {vistaActiva === 'mecanico' && (
                <div className="vista-mecanico">
                    {/* ---- Diagnóstico técnico ---- */}
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

            {/* ---- Servicio ---- */}
            <h2 className="subtitulo">ASIGNACIÓN DE SERVICIOS</h2>
            <div className="servicio-grid">
                <div className="campo">
                    <label>Seleccionar Servicio:</label>
                    <select 
                        value={servicioSeleccionadoId} 
                        onChange={(e) => setServicioSeleccionadoId(e.target.value)}
                    >
                        <option value="">Seleccione un servicio de la lista</option>
                        {serviciosDisponibles.map(s => (
                            <option key={s.id_servicio} value={s.id_servicio}>
                                {s.nombre_servicio} — ${Number(s.precio_base || s.precio || 0).toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <button 
                        type="button" 
                        className="btn-2" 
                        style={{ backgroundColor: '#10B981', borderColor: '#10B981', color: 'white', marginTop: 'auto' }}
                        onClick={handleAgregarServicio}
                        disabled={!servicioSeleccionadoId || (servicioSeleccionadoEsEspecial && !servicioSeleccionadoDescripcionEspecial.trim())}
                    >
                        + Agregar Servicio
                    </button>
                </div>
            </div>

            {servicioSeleccionadoId && (
                <div className="servicio-grid mt-2">
                    <div className="checkbox-item" style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                            type="checkbox" 
                            id="es_especial" 
                            checked={servicioSeleccionadoEsEspecial} 
                            onChange={(e) => setServicioSeleccionadoEsEspecial(e.target.checked)} 
                        />
                        <label htmlFor="es_especial">¿Es servicio especial?</label>
                    </div>
                    {servicioSeleccionadoEsEspecial && (
                        <div className="campo">
                            <label>Descripción especial:</label>
                            <input 
                                type="text" 
                                value={servicioSeleccionadoDescripcionEspecial} 
                                onChange={(e) => setServicioSeleccionadoDescripcionEspecial(e.target.value)} 
                                placeholder="Describa el trabajo especial..." 
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="campo mt-2">
                <label>Prioridad de la orden:</label>
                <select name="prioridad" value={formData.prioridad} onChange={handleInputChange} style={{ maxWidth: '300px' }}>
                    <option value="baja">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                </select>
            </div>

            {/* ---- Repuestos ---- */}
            <div className="repuestos-seccion">
                <div className="checkbox-item">
                    <input type="checkbox" id="repuesto" />
                    <label htmlFor="repuesto">¿Requiere repuesto?</label>
                </div>
                <div className="campo">
                    <label>Repuesto en inventario:</label>
                    <select>
                        <option value="">Seleccione un repuesto</option>
                        {Array.isArray(repuestos) && repuestos.map((rep, index) => (
                            <option key={rep.id_inventario || index} value={rep.id_inventario}>
                                {rep.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ---- Costos ---- */}
            <div className="diagnostico-tecnico mt-4">
                <div className="campo">
                    <label>Servicios ($):</label>
                    <input type="text" className="campo-lectura" readOnly value={`$${serviciosTotal.toFixed(2)}`} />
                </div>
                <div className="mano-obra">
                    <div className="checkbox-item">
                        <input type="checkbox" id="manoObra" />
                        <label htmlFor="manoObra">¿Mano de obra especial?</label>
                    </div>
                    <div className="campo">
                        <label>Costo mano de obra ($):</label>
                        <input type="number" value={manoObra} onChange={(e) => setManoObra(e.target.value)} min="0" step="0.01" />
                    </div>
                </div>
                <div className="campo">
                    <label>Repuesto extra ($):</label>
                    <input type="number" value={repuestoCosto} onChange={(e) => setRepuestoCosto(e.target.value)} min="0" step="0.01" />
                </div>
                <div className="campo subtotal">
                    <label>Total estimado ($):</label>
                    <input type="text" className="campo-lectura campo-destacado" readOnly value={`$${totalOrden.toFixed(2)}`} />
                </div>
            </div>

                </div>
            )}

            {/* ---- MÓDULO DE RESUMEN (Visible en ambas vistas o al final) ---- */}
            {serviciosSeleccionados.length > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '10px', border: '2px solid #10B981', margin: '20px 0' }}>
                    <h2 className="subtitulo" style={{ borderLeftColor: '#10B981', marginTop: 0 }}>RESUMEN DE RECEPCIÓN (SERVICIOS ASIGNADOS)</h2>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: '15px 0' }}>
                        {serviciosSeleccionados.map(s => (
                            <li key={s.id_servicio} style={{ display: 'flex', flexDirection: 'column', padding: '10px', borderBottom: '1px solid #d1fae5', fontSize: '1.1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>🛠 {s.nombre_servicio} {s.es_especial && <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded ml-2 uppercase tracking-wide">Especial</span>}</span>
                                    <div>
                                        <strong style={{ color: '#065f46', marginRight: '15px' }}>${s.precio_base.toFixed(2)}</strong>
                                        {vistaActiva === 'mecanico' && (
                                            <button 
                                                type="button" 
                                                onClick={() => handleEliminarServicio(s.id_servicio)} 
                                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                ✕ Quitar
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {s.es_especial && s.descripcion_especial && (
                                    <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#475569', fontStyle: 'italic' }}>
                                        Detalle: {s.descripcion_especial}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div style={{ textAlign: 'right', fontSize: '1.4rem', fontWeight: 'bold', color: '#10B981', marginTop: '10px' }}>
                        TOTAL SERVICIOS: ${serviciosTotal.toFixed(2)}
                    </div>
                </div>
            )}

            {/* ÔöÇÔöÇ Acciones ÔöÇÔöÇ */}
            <div className="botones-accion no-print">
                <button className="btn-imprimir" type="button" onClick={handleImprimirOrden}>Imprimir Orden</button>
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
