import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/tablas.css';
import api from '../services/axios.js';

export const ListaServicio = () => {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null); // { tipo: 'ok' | 'error' | 'info', mensaje: '' }
    const [mostrarPendientes, setMostrarPendientes] = useState(true);

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const ordenesFiltradas = mostrarPendientes
        ? ordenes.filter((orden) => ['recepcion', 'en_espera', 'en_reparacion', 'esperando_repuestos'].includes(orden.estado))
        : ordenes;

    const cargarOrdenes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/ordenes');
            const dataPayload = res.data.data;

            // Extracción inteligente: asegurar que sea un array iterable
            let ordenesArray = [];
            if (Array.isArray(dataPayload)) {
                ordenesArray = dataPayload;
            } else if (dataPayload && Array.isArray(dataPayload.ordenes)) {
                ordenesArray = dataPayload.ordenes;
            }

            setOrdenes(ordenesArray);
        } catch (error) {
            console.error("Error cargando órdenes", error);
            setFeedback({ tipo: 'error', mensaje: 'Error al cargar la lista de órdenes' });
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (confirm('¿Está seguro de eliminar esta orden?')) {
            setFeedback(null);
            try {
                await api.delete(`/ordenes/${id}`);
                setFeedback({ tipo: 'ok', mensaje: 'Orden eliminada exitosamente' });
                cargarOrdenes();
            } catch (err) {
                if (err.response?.status === 400 && err.response.data?.errors) {
                    const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
                    setFeedback({ tipo: 'error', mensaje: msgs });
                } else {
                    setFeedback({
                        tipo: 'error',
                        mensaje: err.response?.data?.error || 'Error al eliminar la orden'
                    });
                }
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

    const feedbackStyles = {
        ok:    { backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' },
        error: { backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' },
        info:  { backgroundColor: '#E0F2FE', color: '#0C4A6E', border: '1px solid #7DD3FC' }
    };

    if (loading) {
        return <div className="tabla-container">Cargando órdenes...</div>;
    }

    const usuarioStr = localStorage.getItem('usuario');
    const usuarioInfo = usuarioStr ? JSON.parse(usuarioStr) : null;
    const permisos = usuarioInfo?.permisos || {};
    const hasAnyPermission = permisos.recepcion || permisos.mecanico || permisos.admin_caja || permisos.inventario;
    const tienePermisoRecepcion = !hasAnyPermission || permisos.recepcion || permisos.admin_caja;
    const tienePermisoMecanico = !hasAnyPermission || permisos.mecanico || permisos.admin_caja;

    return (
        <div className="tabla-container">
            <h1 className="titulo-tabla">LISTADO DE ORDENES</h1>
            
            <div className="tabla-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                {tienePermisoRecepcion && (
                    <button className="btn-generar" onClick={() => navigate('/panel/Orden-Servicio')}>+ Generar Orden</button>
                )}
                {tienePermisoMecanico && (
                    <button className="btn-2" style={{ borderColor: '#0ea5e9', color: '#0ea5e9' }} onClick={() => setMostrarPendientes(!mostrarPendientes)}>
                        {mostrarPendientes ? 'Mostrar todas' : 'Solo pendientes'}
                    </button>
                )}
            </div>

            {/* ── Feedback de operación ── */}
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
                    {ordenesFiltradas.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                {mostrarPendientes ? 'No hay órdenes pendientes de revisión.' : 'No hay órdenes registradas.'}
                            </td>
                        </tr>
                    ) : (
                        ordenesFiltradas.map((orden) => (
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
