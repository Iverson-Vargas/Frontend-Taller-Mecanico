import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ordenService } from '../services/apiService.js';
import api from '../services/axios.js';
import '../assets/orden-servicio.css';

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
        estado: 'recepcion'
    });

    const [clienteData, setClienteData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: ''
    });

    const [vehiculoData, setVehiculoData] = useState({
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        kilometraje: ''
    });

    const [vehiculosList, setVehiculosList] = useState([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');

    useEffect(() => {
        cargarMecanicos();
        cargarRepuestos();
    }, []);

    const cargarMecanicos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/empleados');
            const data = await response.json();
            if (data.data) setMecanicos(data.data);
        } catch (error) {
            console.error('Error cargando mecánicos:', error);
        }
    };

    const cargarRepuestos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/inventario');
            const data = await response.json();
            if (data.data) setRepuestos(data.data);
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
            // Buscar cliente por cédula usando el endpoint de consulta
            const response = await api.get(`/clientes/consulta/${encodeURIComponent(cedula)}`);
            
            if (response.data && response.data.data) {
                const cliente = response.data.data;
                
                // Llenar datos del cliente
                setClienteData({
                    cedula: cliente.cedula_rif || cedula,
                    nombre: cliente.nombre || '',
                    apellido: cliente.apellido || '',
                    telefono: cliente.telefono || '',
                    direccion: cliente.direccion || ''
                });

                // Buscar vehículos del cliente
                await buscarVehiculosPorCliente(cliente.id_cliente);
                
                alert(`Cliente encontrado: ${cliente.nombre} ${cliente.apellido}`);
            } else {
                alert('Cliente no encontrado. Debe registrarlo primero.');
                limpiarDatosCliente();
            }
        } catch (error) {
            console.error('Error buscando cliente:', error);
            if (error.response?.status === 404) {
                alert('Cliente no encontrado. Debe registrarlo primero.');
            } else {
                alert('Error al buscar el cliente');
            }
            limpiarDatosCliente();
        } finally {
            setLoading(false);
        }
    };

    // Buscar vehículos por ID de cliente
    const buscarVehiculosPorCliente = async (idCliente) => {
        try {
            // Intentar obtener vehículos del cliente
            const response = await api.get(`/vehiculos/cliente/${idCliente}`);
            if (response.data && response.data.data && response.data.data.length > 0) {
                setVehiculosList(response.data.data);
                setVehiculoSeleccionado('');
                alert(`Cliente tiene ${response.data.data.length} vehículo(s) registrado(s)`);
            } else {
                setVehiculosList([]);
                alert('El cliente no tiene vehículos registrados. Debe registrar uno.');
            }
        } catch (error) {
            console.error('Error buscando vehículos:', error);
            setVehiculosList([]);
        }
    };

    // Cargar datos del vehículo seleccionado
    const handleSeleccionarVehiculo = async (placa) => {
        setVehiculoSeleccionado(placa);
        try {
            const response = await api.get(`/vehiculos/${placa}`);
            if (response.data && response.data.data) {
                const vehiculo = response.data.data;
                setVehiculoData({
                    placa: vehiculo.placa || '',
                    marca: vehiculo.marca || '',
                    modelo: vehiculo.modelo || '',
                    ano: vehiculo.ano || '',
                    kilometraje: vehiculo.kilometraje || ''
                });
                // Actualizar formData con la placa seleccionada
                setFormData(prev => ({
                    ...prev,
                    placa_carro: vehiculo.placa
                }));
            }
        } catch (error) {
            console.error('Error cargando vehículo:', error);
        }
    };

    const limpiarDatosCliente = () => {
        setClienteData({
            cedula: '',
            nombre: '',
            apellido: '',
            telefono: '',
            direccion: ''
        });
        setVehiculosList([]);
        setVehiculoData({
            placa: '',
            marca: '',
            modelo: '',
            ano: '',
            kilometraje: ''
        });
        setVehiculoSeleccionado('');
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

    const handleGuardarOrden = async () => {
        if (!formData.placa_carro) {
            alert('Debe seleccionar un vehículo');
            return;
        }
        if (!formData.falla_declarada) {
            alert('La falla declarada es requerida');
            return;
        }

        setLoading(true);
        try {
            const response = await ordenService.create(formData);
            if (response.status === 201 || response.status === 200) {
                alert('Orden guardada exitosamente');
                navigate('/panel/Lista-Servicio');
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
        <div className="orden-container">
            <div className="botones">
                <button className="btn-2" onClick={handListaServicio}>
                    Listado de servicios
                </button>
                <button className="btn-2" onClick={handListaClientes}>
                    Listado de clientes
                </button>
            </div>

            <h1 className="titulo-principal">ORDEN DE SERVICIO</h1>

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
            </div>

            <div className="estado-mecanico">
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
                                {mec.nombre} {mec.apellido}
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
                            placeholder="V-12345678" 
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
                        name="nombre"
                        value={clienteData.nombre}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
                <div className="campo">
                    <label>Teléfono:</label>
                    <input 
                        type="text" 
                        name="telefono"
                        value={clienteData.telefono}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </div>
            </div>

            <h2 className="subtitulo">DATOS DEL VEHÍCULO</h2>
            
            {/* Mostrar selector de vehículos si hay varios */}
            {vehiculosList.length > 0 && (
                <div className="seccion-grid" style={{ marginBottom: '15px' }}>
                    <div className="campo">
                        <label>Seleccionar vehículo:</label>
                        <select 
                            value={vehiculoSeleccionado} 
                            onChange={(e) => handleSeleccionarVehiculo(e.target.value)}
                        >
                            <option value="">Seleccione un vehículo</option>
                            {vehiculosList.map(veh => (
                                <option key={veh.placa} value={veh.placa}>
                                    {veh.placa} - {veh.marca} {veh.modelo} ({veh.ano})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

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
                <div className="campo">
                    <label>Capacidad del tanque:</label>
                    <input type="text" placeholder="Litros" />
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
                    <label>Falladas declaradas (descripción):</label>
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
                    <label>Categoría del servicio:</label>
                    <select>
                        <option value="">Seleccione</option>
                        <option>Sencillo</option>
                        <option>Pesado</option>
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

            <div className="costos-grid">
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
        </div>
    );
};