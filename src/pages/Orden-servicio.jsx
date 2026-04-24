import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordenService } from '../services/apiService.js';
import api from '../services/axios.js';
import '../assets/orden-servicio.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const OrdenServicio = () => {
    const navigate = useNavigate();
    const [mecanicos, setMecanicos] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        placa_carro: '',
        id_mecanico: null,
        motivo_visita: '',
        falla_declarada: '',
        tiene_caucho: false,
        tiene_radio: false,
        tiene_rayones: false,
        observaciones: '',
        estado: 'recepcion',
        prioridad: 'normal'
    });

    const [clienteData, setClienteData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: ''
    });

    const [vehiculoData, setVehiculoData] = useState({
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        kilometraje: ''
    });

    useEffect(() => {
        cargarMecanicos();
        cargarRepuestos();
    }, []);

    const cargarMecanicos = async () => {
        try {
            const response = await api.get('/empleados');
            if (response.data && response.data.data) {
                setMecanicos(response.data.data);
            }
        } catch (error) {
            console.error('Error cargando mecánicos:', error);
        }
    };

    const cargarRepuestos = async () => {
        try {
            const response = await api.get('/inventario');
            if (response.data && response.data.data) {
                setRepuestos(response.data.data);
            }
        } catch (error) {
            console.error('Error cargando repuestos:', error);
        }
    };

    // Buscar cliente por cédula
    const handleBuscarCliente = async () => {
        const cedula = clienteData.cedula.trim();
        if (!cedula) {
            alert('Ingrese una cédula para buscar');
            return;
        }

        setLoading(true);
        try {
            // 1. Buscar cliente por cédula
            const clienteResponse = await api.get(`/clientes/consulta/${cedula}`);
            console.log('Cliente respuesta:', clienteResponse.data);
            
            if (clienteResponse.data && clienteResponse.data.data) {
                const cliente = clienteResponse.data.data;
                
                // Llenar datos del cliente
                setClienteData({
                    cedula: cliente.cedula_rif || cedula,
                    nombre: cliente.nombre || '',
                    apellido: cliente.apellido || '',
                    telefono: cliente.telefono || ''
                });

                // 2. Buscar vehículos del cliente usando la cédula
                const vehiculosResponse = await api.get(`/carros/cliente/${cedula}`);
                console.log('Vehículos respuesta:', vehiculosResponse.data);
                
                if (vehiculosResponse.data && vehiculosResponse.data.data && vehiculosResponse.data.data.length > 0) {
                    const vehiculo = vehiculosResponse.data.data[0];
                    setVehiculoData({
                        placa: vehiculo.placa || '',
                        marca: vehiculo.marca || '',
                        modelo: vehiculo.modelo || '',
                        ano: vehiculo.ano || '',
                        kilometraje: vehiculo.kilometraje || ''
                    });
                    setFormData(prev => ({
                        ...prev,
                        placa_carro: vehiculo.placa
                    }));
                    alert(`Cliente encontrado: ${cliente.nombre} ${cliente.apellido} - Vehículo: ${vehiculo.placa}`);
                } else {
                    alert('Cliente encontrado pero no tiene vehículos registrados');
                    setVehiculoData({
                        placa: '',
                        marca: '',
                        modelo: '',
                        ano: '',
                        kilometraje: ''
                    });
                }
            } else {
                alert('Cliente no encontrado');
                limpiarDatosCliente();
            }
        } catch (error) {
            console.error('Error buscando cliente:', error);
            if (error.response?.status === 404) {
                alert('Cliente no encontrado. Debe registrarlo primero.');
            } else {
                alert('Error al buscar el cliente: ' + (error.response?.data?.message || error.message));
            }
            limpiarDatosCliente();
        } finally {
            setLoading(false);
        }
    };

    const limpiarDatosCliente = () => {
        setClienteData({
            cedula: '',
            nombre: '',
            apellido: '',
            telefono: ''
        });
        setVehiculoData({
            placa: '',
            marca: '',
            modelo: '',
            ano: '',
            kilometraje: ''
        });
        setFormData(prev => ({
            ...prev,
            placa_carro: ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleClienteInputChange = (e) => {
        const { name, value } = e.target;
        setClienteData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        handleGuardarOrden();
    };

    const handleGuardarOrden = async () => {
        if (!formData.placa_carro) {
            alert('Debe buscar un cliente con vehículo primero');
            return;
        }
        if (!formData.falla_declarada) {
            alert('La falla declarada es requerida');
            return;
        }

        setLoading(true);
        try {
            const ordenData = {
                placa_carro: formData.placa_carro,
                id_mecanico: formData.id_mecanico ? parseInt(formData.id_mecanico) : null,
                motivo_visita: formData.motivo_visita || null,
                falla_declarada: formData.falla_declarada,
                tiene_caucho: formData.tiene_caucho,
                tiene_radio: formData.tiene_radio,
                tiene_rayones: formData.tiene_rayones,
                observaciones: formData.observaciones || null,
                estado: formData.estado
            };

            console.log('Guardando orden:', ordenData);
            const response = await api.post('/ordenes', ordenData);
            console.log('Respuesta:', response.data);
            
            if (response.data.status === 201 || response.status === 201) {
                alert(`Orden guardada exitosamente. Número: ${response.data.data?.id_orden || 'generado'}`);
                // Limpiar formulario
                setFormData({
                    placa_carro: '',
                    id_mecanico: null,
                    motivo_visita: '',
                    falla_declarada: '',
                    tiene_caucho: false,
                    tiene_radio: false,
                    tiene_rayones: false,
                    observaciones: '',
                    estado: 'recepcion'
                });
                setClienteData({
                    cedula: '',
                    nombre: '',
                    apellido: '',
                    telefono: ''
                });
                setVehiculoData({
                    placa: '',
                    marca: '',
                    modelo: '',
                    ano: '',
                    kilometraje: ''
                });
                navigate('/panel/Lista-Servicio');
            } else {
                alert('Error al guardar la orden: ' + (response.data?.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error guardando orden:', error);
            alert(error.response?.data?.message || 'Error al guardar la orden');
        } finally {
            setLoading(false);
        }
    };

    const handListaServicio = () => {
        navigate('/panel/Lista-Servicio');
    };

    const handListaClientes = () => {
        navigate('/panel/Listado-Clientes');
    };

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
                        {mecanicos.map(mec => (
                            <option key={mec.id_empleado} value={mec.id_empleado}>
                                {mec.nombre} {mec.apellido} - {mec.cargo}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

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
                        value={clienteData.nombre}
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

            <h2 className="subtitulo">DATOS DEL VEHÍCULO</h2>
            <div className="seccion-grid">
                <div className="campo">
                    <label>Placa:</label>
                    <input 
                        type="text" 
                        value={vehiculoData.placa}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
                <div className="campo">
                    <label>Marca:</label>
                    <input 
                        type="text" 
                        value={vehiculoData.marca}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
                <div className="campo">
                    <label>Modelo:</label>
                    <input 
                        type="text" 
                        value={vehiculoData.modelo}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
                <div className="campo">
                    <label>Año:</label>
                    <input 
                        type="text" 
                        value={vehiculoData.ano}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
                <div className="campo">
                    <label>Kilometraje actual:</label>
                    <input 
                        type="text" 
                        value={vehiculoData.kilometraje}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
            </div>

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

            <h2 className="subtitulo">DIAGNÓSTICO TÉCNICO</h2>
            <div className="diagnostico-tecnico">
                <div className="campo">
                    <label>Diagnóstico:</label>
                    <input type="text" name="diagnostico" onChange={handleInputChange} />
                </div>
                <div className="campo">
                    <label>Observaciones:</label>
                    <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows="3"></textarea>
                </div>
            </div>

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

            <div className="repuestos-seccion">
                <div className="checkbox-item">
                    <input type="checkbox" id="repuesto" />
                    <label htmlFor="repuesto">¿Requiere repuesto?</label>
                </div>
                <div className="campo">
                    <label>Repuesto en inventario:</label>
                    <select>
                        <option value="">Seleccione un repuesto</option>
                        {repuestos.map(rep => (
                            <option key={rep.id_inventario} value={rep.id_inventario}>
                                {rep.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

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

            <div className="botones-accion">
                <button className="btn-imprimir">Imprimir Orden</button>
                <button className="btn-guardar" onClick={handleGuardarOrden} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Orden'}
                </button>
            </div>
        </form>
    );
};