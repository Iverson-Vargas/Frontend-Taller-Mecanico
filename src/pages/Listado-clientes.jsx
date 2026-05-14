import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/tablas.css";
import api from "../services/axios.js";

export const ListaClientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [feedback, setFeedback] = useState(null); // { tipo: 'ok'|'error'|'info', mensaje: '' }

    const [modalAbierto, setModalAbierto] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);
    const [formEdit, setFormEdit] = useState({
        cedula_rif: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        correo: ''
    });

    const [modalVehiculosAbierto, setModalVehiculosAbierto] = useState(false);
    const [vehiculosCliente, setVehiculosCliente] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    useEffect(() => {
        cargarClientes();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === '') {
            setClientesFiltrados(clientes);
        } else {
            const filtrados = clientes.filter(cliente =>
                cliente.cedula_rif && cliente.cedula_rif.toLowerCase().includes(busqueda.toLowerCase())
            );
            setClientesFiltrados(filtrados);
        }
    }, [busqueda, clientes]);

    const cargarClientes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/clientes');
            const dataPayload = res.data.data;
            
            // El backend devuelve { success, data: { clientes: [], total: ... } }
            // Hacemos un fallback seguro por si en algún momento devuelve el array directo
            let datosClientes = [];
            if (Array.isArray(dataPayload)) {
                datosClientes = dataPayload;
            } else if (dataPayload && Array.isArray(dataPayload.clientes)) {
                datosClientes = dataPayload.clientes;
            }

            setClientes(datosClientes);
            setClientesFiltrados(datosClientes);
            setError('');
        } catch (err) {
            console.error('Error al cargar clientes:', err);
            setError('Error al cargar la lista de clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleRegresar = () => {
        navigate('/panel/RegistroCliente');
    };

    const handleAbrirModalEditar = (cliente) => {
        setFeedback(null);
        setClienteEditando(cliente);
        setFormEdit({
            cedula_rif: cliente.cedula_rif || '',
            nombre: cliente.nombre || '',
            apellido: cliente.apellido || '',
            telefono: cliente.telefono || '',
            direccion: cliente.direccion || '',
            correo: cliente.correo || ''
        });
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setClienteEditando(null);
        setFormEdit({
            cedula_rif: '',
            nombre: '',
            apellido: '',
            telefono: '',
            direccion: '',
            correo: ''
        });
    };

    const handleChangeEdit = (e) => {
        setFormEdit({
            ...formEdit,
            [e.target.name]: e.target.value
        });
        if (feedback) setFeedback(null);
    };

    const handleGuardarEdicion = async () => {
        if (!clienteEditando) return;

        setFeedback(null);

        if (!formEdit.cedula_rif || !formEdit.nombre || !formEdit.apellido) {
            setFeedback({ tipo: 'error', mensaje: 'Los campos Cedula, Nombre y Apellido son obligatorios' });
            return;
        }

        try {
            const datosActualizar = {
                cedula_rif: formEdit.cedula_rif,
                nombre: formEdit.nombre,
                apellido: formEdit.apellido,
                telefono: formEdit.telefono || '',
                direccion: formEdit.direccion || '',
                correo: formEdit.correo || ''
            };
            
            await api.put(`/clientes/${clienteEditando.id_cliente || clienteEditando.id}`, datosActualizar);
            
            setFeedback({ tipo: 'ok', mensaje: 'Cliente actualizado exitosamente' });
            handleCerrarModal();
            cargarClientes();

        } catch (err) {
            if (err.response?.status === 400 && err.response.data?.errors) {
                const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                setFeedback({ tipo: 'error', mensaje: msgs });
            } else {
                setFeedback({
                    tipo: 'error',
                    mensaje: err.response?.data?.error || 'Error al actualizar el cliente'
                });
            }
        }
    };

    const handleVerVehiculos = async (cliente) => {
        try {
            setClienteSeleccionado(cliente);
            const response = await api.get(`/carros/cliente/${cliente.cedula_rif}`);
            const vehiculos = response.data.data || [];
            
            setVehiculosCliente(vehiculos);
            setModalVehiculosAbierto(true);
        } catch (err) {
            console.error('Error al cargar vehículos:', err);
            setVehiculosCliente([]);
            setModalVehiculosAbierto(true);
        }
    };

    const handleCerrarModalVehiculos = () => {
        setModalVehiculosAbierto(false);
        setVehiculosCliente([]);
        setClienteSeleccionado(null);
    };

    const handleAgregarVehiculo = (cliente) => {
        navigate(`/panel/RegistroVehiculo?cedula=${cliente.cedula_rif}&nombre=${encodeURIComponent(cliente.nombre)}&apellido=${encodeURIComponent(cliente.apellido)}`);
    };

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' },
        info:  { backgroundColor: '#E0F2FE', color: '#0C4A6E', border: '1px solid #7DD3FC' }
    };

    if (loading) {
        return (
            <div className="tabla-container">
                <div style={{ textAlign: 'center', padding: '40px' }}>Cargando clientes...</div>
            </div>
        );
    }

    return (
        <div className="tabla-container">
            <div className="tabla-header">
                <div className="busqueda-filtro">
                    <div className="campo-busqueda">
                        <input
                            type="text"
                            className="busqueda-input"
                            placeholder="Buscar por cedula o rif..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={handleRegresar}
                    className="btn-generar"
                >
                    Regresar al Registro
                </button>
            </div>

            <h1 className="titulo-tabla">Listado de Clientes</h1>

            {/* FEEDBACK */}
            {feedback && (
                <div style={{
                    ...feedbackStyles[feedback.tipo],
                    padding: '12px 20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    fontSize: '15px'
                }}>
                    {feedback.mensaje}
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                    <p>{error}</p>
                    <button onClick={cargarClientes} className="btn-generar" style={{ marginTop: '10px' }}>
                        Reintentar
                    </button>
                </div>
            )}

            {!error && clientesFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>{busqueda ? 'No se encontraron clientes con esa cedula' : 'No hay clientes registrados'}</p>
                </div>
            )}

            {!error && clientesFiltrados.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table className="ordenes-tabla">
                        <thead>
                            <tr>
                                <th>Cedula/RIF</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Telefono</th>
                                <th>Direccion</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map((cliente, index) => (
                                <tr key={cliente.id_cliente || index}>
                                    <td data-label="Cedula/RIF">{cliente.cedula_rif || cliente.cedula}</td>
                                    <td data-label="Nombre">{cliente.nombre}</td>
                                    <td data-label="Apellido">{cliente.apellido}</td>
                                    <td data-label="Telefono">{cliente.telefono}</td>
                                    <td data-label="Direccion">{cliente.direccion}</td>
                                    <td data-label="Correo">{cliente.correo}</td>
                                    <td data-label="Acciones">
                                        <button
                                            onClick={() => handleAbrirModalEditar(cliente)}
                                            className="btn-accion editar"
                                            title="Editar cliente"
                                        >
                                            ✎ Editar
                                        </button>
                                        <button
                                            onClick={() => handleVerVehiculos(cliente)}
                                            className="btn-accion ver"
                                            title="Ver vehiculos"
                                        >
                                            ⛍ Ver vehículos
                                        </button>
                                        <button
                                            onClick={() => handleAgregarVehiculo(cliente)}
                                            className="btn-accion ver"
                                            title="Agregar vehículo"
                                        >
                                            ⛉ Agregar vehículo
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL EDITAR CLIENTE */}
            {modalAbierto && (
                <div className="modal-overlay" onClick={handleCerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Editar Cliente</h2>

                        {/* Mostrar feedback también dentro del modal si es pertinente */}
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

                        <div className="modal-field">
                            <label>Cedula/RIF</label>
                            <input
                                type="text"
                                name="cedula_rif"
                                value={formEdit.cedula_rif}
                                onChange={handleChangeEdit}
                                placeholder="Ingrese cedula o rif"
                            />
                        </div>

                        <div className="modal-field">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formEdit.nombre}
                                onChange={handleChangeEdit}
                                placeholder="Ingrese nombre"
                            />
                        </div>

                        <div className="modal-field">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formEdit.apellido}
                                onChange={handleChangeEdit}
                                placeholder="Ingrese apellido"
                            />
                        </div>

                        <div className="modal-field">
                            <label>Telefono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formEdit.telefono}
                                onChange={handleChangeEdit}
                                placeholder="Ingrese telefono"
                            />
                        </div>

                        <div className="modal-field">
                            <label>Direccion</label>
                            <input
                                type="text"
                                name="direccion"
                                value={formEdit.direccion}
                                onChange={handleChangeEdit}
                                placeholder="Ingrese direccion"
                            />
                        </div>

                        <div className="modal-field">
                            <label>Correo</label>
                            <input
                                type="email"
                                name="correo"
                                value={formEdit.correo}
                                onChange={handleChangeEdit}
                                placeholder="Ingrese correo"
                            />
                        </div>

                        <div className="modal-buttons">
                            <button onClick={handleCerrarModal} className="modal-btn-cancelar">
                                Cancelar
                            </button>
                            <button onClick={handleGuardarEdicion} className="modal-btn-guardar">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL VER VEHICULOS */}
            {modalVehiculosAbierto && (
                <div className="modal-overlay" onClick={handleCerrarModalVehiculos}>
                    <div className="modal-content vehiculos-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Vehículos de {clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}</h2>
                        <p className="modal-subtitle">Cedula: {clienteSeleccionado?.cedula_rif}</p>

                        {vehiculosCliente.length === 0 ? (
                            <p className="no-vehiculos">Este cliente no tiene vehículos registrados</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="ordenes-tabla">
                                    <thead>
                                        <tr>
                                            <th>Placa</th>
                                            <th>Marca</th>
                                            <th>Modelo</th>
                                            <th>Año</th>
                                            <th>Kilometraje</th>
                                            <th>Numero Orden</th>
                                            <th>Estado Orden</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehiculosCliente.map((vehiculo, index) => (
                                            <tr key={index}>
                                                <td data-label="Placa">{vehiculo.placa}</td>
                                                <td data-label="Marca">{vehiculo.marca}</td>
                                                <td data-label="Modelo">{vehiculo.modelo}</td>
                                                <td data-label="Año">{vehiculo.ano}</td>
                                                <td data-label="Kilometraje">{vehiculo.kilometraje}</td>
                                                <td data-label="Numero Orden">{vehiculo.numero_orden || vehiculo.orden_id || '-'}</td>
                                                <td data-label="Estado Orden">
                                                    <span className={`estado-${(vehiculo.estado_orden || 'pendiente').toLowerCase()}`}>
                                                        {vehiculo.estado_orden || 'Pendiente'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="modal-buttons">
                            <button onClick={handleCerrarModalVehiculos} className="modal-btn-cerrar">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
