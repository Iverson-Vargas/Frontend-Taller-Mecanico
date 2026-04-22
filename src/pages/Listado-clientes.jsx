<<<<<<< HEAD
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
            setClientes(data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        }
    };

    const clientesFiltrados = clientes.filter(cliente =>
        (cliente.cedula_rif || "").toLowerCase().includes(busqueda.toLowerCase())
    );
=======
import '../assets/tablas.css';
import '../assets/tablas.css';

export const ListaClientes = () => {
>>>>>>> reportes

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
                        <th>ID</th>
                        <th>Cédula / RIF</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map((cliente) => (
                            <tr key={cliente.id_cliente}>
                                <td>{cliente.id_cliente}</td>
                                <td>{cliente.cedula_rif}</td>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.apellido}</td>
                                <td>{cliente.telefono}</td>
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