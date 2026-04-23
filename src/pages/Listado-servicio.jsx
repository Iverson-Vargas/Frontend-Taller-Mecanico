import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/tablas.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ListaServicio = () => {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');

    useEffect(() => {
        fetchOrdenes();
    }, []);

    const fetchOrdenes = async () => {
        try {
            const res = await fetch(`${API_URL}/ordenes`);
            const data = await res.json();
            const arr = data.data?.ordenes || data.data || [];
            setOrdenes(Array.isArray(arr) ? arr : []);
        } catch (error) {
            console.error("Error al obtener ordenes:", error);
        }
    };

    const handleGenerarOrden = () => {
        navigate('/panel/Orden-Servicio');
    };

    const eliminarOrden = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar esta orden?")) return;
        try {
            await fetch(`${API_URL}/ordenes/${id}`, { method: 'DELETE' });
            fetchOrdenes();
        } catch (error) {
            console.error("Error al eliminar orden", error);
        }
    };

    const ordenesFiltradas = ordenes.filter(orden => {
        const matchBusqueda = (orden.id_orden?.toString().includes(busqueda) || 
                              orden.placa_carro?.toLowerCase().includes(busqueda.toLowerCase()));
        const matchEstado = estadoFiltro === '' || orden.estado === estadoFiltro;
        return matchBusqueda && matchEstado;
    });

    return (
        <div className="tabla-container">
            <h1 className="titulo-tabla">LISTADO DE ORDENES</h1>

            <div className="tabla-header">
                <div className="busqueda-filtro">
                    <div className="campo-busqueda">
                        <input 
                            type="text" 
                            placeholder="Buscar por N° o placa..."
                            className="busqueda-input"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    
                    <div className="filtro-estado">
                        <select className="estado-select" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                            <option value="">Todos los estados</option>
                            <option value="recepcion">Recepción / Activa</option>
                            <option value="en_espera">En espera</option>
                            <option value="diagnostico">En diagnóstico</option>
                            <option value="espera_repuesto">Espera de repuesto</option>
                            <option value="reparacion">Reparación</option>
                            <option value="finalizada">Finalizada</option>
                            <option value="entregada">Entregada</option>
                        </select>
                    </div>
                </div>

                <button className="btn-generar" onClick={handleGenerarOrden}>
                    + Generar Orden
                </button>
            </div>

            <table className="ordenes-tabla">
                <thead>
                    <tr>
                        <th>N° de Orden</th>
                        <th>Fecha de la Orden</th>
                        <th>Placa Vehículo</th>
                        <th>Estado</th>
                        <th>Cód. Mecánico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenesFiltradas.length > 0 ? ordenesFiltradas.map(orden => (
                        <tr key={orden.id_orden}>
                            <td>#{orden.id_orden}</td>
                            <td>{new Date(orden.fecha_creacion).toLocaleDateString()}</td>
                            <td>{orden.placa_carro || 'N/A'}</td>
                            <td>
                                <span className={`estado-badge ${orden.estado}`}>
                                    {orden.estado?.toUpperCase()}
                                </span>
                            </td>
                            <td>{orden.id_mecanico || 'No asignado'}</td>
                            <td>
                                <button className="btn-accion ver">👁</button>
                                <button className="btn-accion editar">✎</button>
                                <button className="btn-accion eliminar" onClick={() => eliminarOrden(orden.id_orden)}>🗑</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No hay ordenes registradas.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};