import { useNavigate } from 'react-router-dom';
import '../assets/tablas.css';

export const ListaServicio = () => {
    const navigate = useNavigate();

    const handleGenerarOrden = () => {
        navigate('/Prueba/Orden-Servicio');
    };

    return (
        <div className="tabla-container">
            <h1 className="titulo-tabla">LISTADO DE ORDENES</h1>

            <div className="tabla-header">
                <div className="busqueda-filtro">
                    <div className="campo-busqueda">
                        <input 
                            type="text" 
                            placeholder="Buscar orden..."
                            className="busqueda-input"
                        />
                    </div>
                    
                    <div className="filtro-estado">
                        <select className="estado-select">
                            <option value="">Todos los estados</option>
                            <option>Activa</option>
                            <option>En espera</option>
                            <option>En diagnóstico</option>
                            <option>Espera de repuesto</option>
                            <option>Reparación</option>
                            <option>Finalizada</option>
                            <option>Entregada</option>
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
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Mecánico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <button className="btn-accion ver">👁</button>
                            <button className="btn-accion editar">✎</button>
                            <button className="btn-accion eliminar">🗑</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};