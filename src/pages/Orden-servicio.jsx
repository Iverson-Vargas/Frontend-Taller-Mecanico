import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/orden-servicio.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const OrdenServicio = () => {
    const navigate = useNavigate();
    const [mecanicos, setMecanicos] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        placa_carro: '',
        id_mecanico: '',
        motivo_visita: '',
        falla_declarada: '',
        tiene_caucho: false,
        tiene_radio: false,
        tiene_rayones: false,
        observaciones: '',
        estado: 'recepcion',
        prioridad: 'normal',
        diagnostico_tecnico: ''
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
    
    const [vehiculosCliente, setVehiculosCliente] = useState([]);

    useEffect(() => {
        cargarMecanicos();
        cargarRepuestos();
    }, []);

    const cargarMecanicos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/empleados');
            const data = await response.json();
            if (data && data.data) {
                setMecanicos(data.data);
            }
        } catch (error) {
            console.error('Error cargando mecánicos:', error);
        }
    };

    const cargarRepuestos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/inventario');
            const data = await response.json();
            if (data && data.data) {
                setRepuestos(data.data);
            }
        } catch (error) {
            console.error('Error cargando repuestos:', error);
        }
    };

    const handleBuscarCliente = async () => {
        const cedula = clienteData.cedula.trim();
        if (!cedula) {
            alert('Ingrese una cédula para buscar');
            return;
        }

        setLoading(true);
        try {
            const resCliente = await fetch(`http://localhost:3001/api/clientes/consulta/${cedula}`);
            if (!resCliente.ok) {
                if (resCliente.status === 404) {
                    alert('Cliente no encontrado. Debe registrarlo primero.');
                } else {
                    alert('Error al buscar el cliente');
                }
                limpiarDatosCliente();
                return;
            }

            const dataCliente = await resCliente.json();
            if (dataCliente && dataCliente.data) {
                const cliente = dataCliente.data;
                
                setClienteData({
                    cedula: cliente.cedula_rif || cedula,
                    nombre: cliente.nombre || '',
                    apellido: cliente.apellido || '',
                    telefono: cliente.telefono || ''
                });

                const resVehiculos = await fetch(`http://localhost:3001/api/carros/cliente/${cedula}`);
                if (resVehiculos.ok) {
                    const dataVehiculos = await resVehiculos.json();
                    if (dataVehiculos && dataVehiculos.data && dataVehiculos.data.length > 0) {
                        setVehiculosCliente(dataVehiculos.data);
                        const vehiculo = dataVehiculos.data[0];
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
                        alert(`Cliente encontrado: ${cliente.nombre} ${cliente.apellido}`);
                    } else {
                        alert('Cliente encontrado pero no tiene vehículos registrados');
                        setVehiculosCliente([]);
                    }
                }
            }
        } catch (error) {
            console.error('Error buscando cliente:', error);
        } finally {
            setLoading(false);
        }
    };

    const limpiarDatosCliente = () => {
        setClienteData({ cedula: '', nombre: '', apellido: '', telefono: '' });
        setVehiculoData({ placa: '', marca: '', modelo: '', ano: '', kilometraje: '' });
        setVehiculosCliente([]);
        setFormData(prev => ({ ...prev, placa_carro: '' }));
    };

    const handleSeleccionarVehiculo = (e) => {
        const placaSeleccionada = e.target.value;
        const vehiculo = vehiculosCliente.find(v => v.placa === placaSeleccionada);
        if (vehiculo) {
            setVehiculoData({
                placa: vehiculo.placa || '',
                marca: vehiculo.marca || '',
                modelo: vehiculo.modelo || '',
                ano: vehiculo.ano || '',
                kilometraje: vehiculo.kilometraje || ''
            });
            setFormData(prev => ({ ...prev, placa_carro: vehiculo.placa }));
        }
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
        setClienteData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Detiene la recarga de página nativa
        
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
                id_mecanico: formData.id_mecanico || null,
                motivo_visita: formData.motivo_visita || null,
                falla_declarada: formData.falla_declarada,
                tiene_caucho: formData.tiene_caucho,
                tiene_radio: formData.tiene_radio,
                tiene_rayones: formData.tiene_rayones,
                observaciones: formData.observaciones || null,
                diagnostico_tecnico: formData.diagnostico_tecnico || null,
                estado: formData.estado
            };

            const response = await fetch('http://localhost:3001/api/ordenes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ordenData)
            });
            const data = await response.json();
            
            if (response.status === 201 || data.status === 201) {
                alert(`Orden guardada exitosamente.`);
                navigate('/panel/Lista-Servicio');
            } else {
                alert('Error al guardar: ' + (data?.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error guardando orden:', error);
            alert('Error de red al guardar la orden');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="orden-container" onSubmit={handleSubmit}>
            <div className="botones">
                <button type="button" className="btn-2" onClick={() => navigate('/panel/Lista-Servicio')}>
                    Listado de servicios
                </button>
                <button type="button" className="btn-2" onClick={() => navigate('/panel/Listado-Clientes')}>
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
                    <select name="id_mecanico" value={formData.id_mecanico} onChange={handleInputChange}>
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
                            placeholder="Ingrese cédula" 
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={handleBuscarCliente} disabled={loading} style={{ padding: '5px 15px' }}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>
                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" value={clienteData.nombre} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>
                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="text" value={clienteData.telefono} readOnly style={{ backgroundColor: '#f5f5f5' }} />
                </div>
            </div>

            <h2 className="subtitulo">DATOS DEL VEHÍCULO</h2>
            {vehiculosCliente.length > 1 && (
                <div className="campo" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Seleccionar Vehículo:</label>
                    <select onChange={handleSeleccionarVehiculo} value={vehiculoData.placa} style={{ width: '100%', padding: '8px' }}>
                        {vehiculosCliente.map(v => (
                            <option key={v.placa} value={v.placa}>
                                {v.placa} - {v.marca} {v.modelo}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="seccion-grid">
                <div className="campo"><label>Placa:</label><input type="text" value={vehiculoData.placa} readOnly style={{ backgroundColor: '#f5f5f5' }} /></div>
                <div className="campo"><label>Marca:</label><input type="text" value={vehiculoData.marca} readOnly style={{ backgroundColor: '#f5f5f5' }} /></div>
                <div className="campo"><label>Modelo:</label><input type="text" value={vehiculoData.modelo} readOnly style={{ backgroundColor: '#f5f5f5' }} /></div>
                <div className="campo"><label>Año:</label><input type="text" value={vehiculoData.ano} readOnly style={{ backgroundColor: '#f5f5f5' }} /></div>
                <div className="campo"><label>Kilometraje actual:</label><input type="text" value={vehiculoData.kilometraje} readOnly style={{ backgroundColor: '#f5f5f5' }} /></div>
            </div>

            <h2 className="subtitulo">DIAGNÓSTICO INICIAL</h2>
            <div className="diagnostico-inicial">
                <div className="campo">
                    <label>Motivo de visita:</label>
                    <textarea name="motivo_visita" value={formData.motivo_visita} onChange={handleInputChange} rows="2"></textarea>
                </div>
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
                    <textarea name="diagnostico_tecnico" value={formData.diagnostico_tecnico} onChange={handleInputChange} rows="3"></textarea>
                </div>
                <div className="campo">
                    <label>Observaciones:</label>
                    <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows="3"></textarea>
                </div>
            </div>

            <div className="botones-accion">
                <button type="button" className="btn-imprimir">Imprimir Orden</button>
                <button type="submit" className="btn-guardar" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Orden'}
                </button>
            </div>
        </form>
    );
};