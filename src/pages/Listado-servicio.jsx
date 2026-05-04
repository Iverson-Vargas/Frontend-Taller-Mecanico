import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/tablas.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ListaServicio = () => {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/api/ordenes');
            const data = await res.json();
            // La respuesta tiene estructura: { message, status, data }
            setOrdenes(data.data || []);
        } catch (error) {
            console.error("Error cargando órdenes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (confirm('¿Está seguro de eliminar esta orden?')) {
            try {
                const res = await fetch(`http://localhost:3001/api/ordenes/${id}`, {
                    method: 'DELETE'
                });
                if (!res.ok) {
                    throw new Error('No se pudo eliminar');
                }
                alert('Orden eliminada');
                cargarOrdenes();
            } catch (error) {
                console.error('Error eliminando orden:', error);
                alert('Error al eliminar la orden');
            }
        }
    };

    const handleVer = (id) => {
        navigate(`/panel/Orden-Servicio/${id}`);
    };

    const getEstadoTexto = (estado) => {
        const estados = {
            'recepcion': 'Recepción',
            'en_espera': 'En espera',
            'en_reparacion': 'En reparación',
            'esperando_repuestos': 'Esperando repuestos',
            'finalizada': 'Finalizada',
            'facturada': 'Facturada',
            'entregada': 'Entregada'
        };
        return estados[estado] || estado;
    };

    if (loading) {
        return <div className="tabla-container">Cargando órdenes...</div>;
    }

    return (
        <div className="tabla-container">
            <h1 className="titulo-tabla">LISTADO DE ORDENES</h1>
            <div className="tabla-header">
                <button className="btn-generar" onClick={() => navigate('/panel/Orden-Servicio')}>+ Generar Orden</button>
            </div>
            <table className="ordenes-tabla">
                <thead>
                    <tr>
                        <th>N° de Orden</th>
                        <th>Placa</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenes.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>No hay órdenes registradas</td>
                        </tr>
                    ) : (
                        ordenes.map((orden) => (
                            <tr key={orden.id_orden}>
                                <td>{orden.id_orden}</td>
                                <td>{orden.placa_carro}</td>
                                <td>{orden.carro?.cliente ? `${orden.carro.cliente.nombre} ${orden.carro.cliente.apellido}` : 'N/A'}</td>
                                <td><span className={`tag-${orden.estado}`}>{getEstadoTexto(orden.estado)}</span></td>
                                <td>
                                    <button className="btn-accion ver" onClick={() => handleVer(orden.id_orden)}>👁</button>
                                    <button className="btn-accion eliminar" onClick={() => handleEliminar(orden.id_orden)}>🗑</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
