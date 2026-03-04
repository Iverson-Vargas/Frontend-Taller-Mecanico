import { useNavigate } from 'react-router-dom';
import '../assets/tablas.css';

export const ListaClientes = () => {
    const navigate = useNavigate();

    return (
        <div className="tabla-container">
            <h1 className="titulo-tabla">LISTADO DE CLIENTES</h1>

            <div className="tabla-header">
                <div className="busqueda-filtro">
                    <div className="campo-busqueda">
                        <input 
                            type="text" 
                            placeholder="Buscar cedula..."
                            className="busqueda-input"
                        />
                    </div>
                </div>
            </div>

            <table className="ordenes-tabla">
                <thead>
                    <tr>
                        <th>N° de cliente</th>
                        <th>Cedula</th>
                        <th>Nombre</th>
                        <th>Servicios activos</th>
                        <th>Ultimo servicio realizado</th>
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
                            <button className="btn-accion ver">👁 Ver expediente</button>
                            <button className="btn-accion editar">✎</button>
                            <button className="btn-accion eliminar">🗑</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};