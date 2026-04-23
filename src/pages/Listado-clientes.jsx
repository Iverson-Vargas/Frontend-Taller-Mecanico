import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/tablas.css';

export const ListaClientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/clientes');
            const data = await respuesta.json();
            
            // Extraer el arreglo de clientes de las posibles estructuras de respuesta
            const arr = data.data?.clientes || data.data || data.clientes || data;
            
            if (Array.isArray(arr)) {
                setClientes(arr);
            } else {
                console.error("Formato de datos inesperado:", data);
                setClientes([]);
            }
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            setClientes([]);
        }
    };

    // Aseguramos que clientes sea un array antes de usar .filter()
    const clientesArray = Array.isArray(clientes) ? clientes : [];
    
    const clientesFiltrados = clientesArray.filter(cliente => 
        (cliente.cedula_rif || "").toLowerCase().includes(busqueda.toLowerCase())
    );

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
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <table className="ordenes-tabla">
                <thead>
                    <tr>
                        <th>N° de cliente</th>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Servicios activos</th>
                        <th>Último servicio realizado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map((cliente) => (
                            <tr key={cliente.id_cliente}>
                                <td>{cliente.id_cliente}</td>
                                <td>{cliente.cedula_rif}</td>
                                <td>{cliente.nombre} {cliente.apellido}</td>
                                <td>{cliente.servicios_activos || '0'}</td>
                                <td>{cliente.ultimo_servicio || 'N/A'}</td>
                                <td>
                                    <button className="btn-accion ver">👁 Ver expediente</button>
                                    <button className="btn-accion editar">✎</button>
                                    <button className="btn-accion eliminar">🗑</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No hay clientes registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};