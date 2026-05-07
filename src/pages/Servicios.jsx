import { useState, useEffect } from 'react';
import '../assets/tablas.css';

export const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nombre_servicio: '',
        tipo_servicio: '',
        precio_base: ''
    });

    useEffect(() => {
        cargarServicios();
    }, []);

    const cargarServicios = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3000/api/servicios');
            const data = await res.json();
            setServicios(data.data || []);
        } catch (error) {
            console.error("Error cargando servicios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        if (!formData.nombre_servicio || !formData.precio_base) {
            alert('Nombre y Precio Base son obligatorios');
            return;
        }

        try {
            const servicioData = {
                nombre_servicio: formData.nombre_servicio,
                tipo_servicio: formData.tipo_servicio,
                precio_base: parseFloat(formData.precio_base)
            };

            const res = await fetch('http://localhost:3000/api/servicios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(servicioData)
            });

            if (res.ok) {
                alert('Servicio guardado exitosamente');
                setFormData({ nombre_servicio: '', tipo_servicio: '', precio_base: '' });
                cargarServicios();
            } else {
                const errData = await res.json();
                alert('Error al guardar: ' + (errData.message || 'Desconocido'));
            }
        } catch (error) {
            console.error('Error guardando servicio:', error);
            alert('Error de red al guardar el servicio');
        }
    };

    const handleEliminar = async (id) => {
        if (confirm('¿Está seguro de eliminar este servicio?')) {
            try {
                const res = await fetch(`http://localhost:3000/api/servicios/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    alert('Servicio eliminado');
                    cargarServicios();
                } else {
                    alert('Error al eliminar');
                }
            } catch (error) {
                console.error('Error eliminando servicio:', error);
                alert('Error de red al eliminar');
            }
        }
    };

    return (
        <div className="tabla-container">
            <h1 className="titulo-tabla">Catálogo de Servicios y Precios</h1>
            
            <div className="form-cliente" style={{ marginBottom: '30px', maxWidth: '600px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Registrar Nuevo Servicio</h3>
                <form onSubmit={handleGuardar}>
                    <div className="campo">
                        <label>Nombre del Servicio:*</label>
                        <input 
                            type="text" 
                            name="nombre_servicio" 
                            value={formData.nombre_servicio} 
                            onChange={handleChange} 
                            placeholder="Ej: Cambio de aceite" 
                        />
                    </div>
                    <div className="campo">
                        <label>Tipo de Servicio:</label>
                        <input 
                            type="text" 
                            name="tipo_servicio" 
                            value={formData.tipo_servicio} 
                            onChange={handleChange} 
                            placeholder="Ej: Preventivo" 
                        />
                    </div>
                    <div className="campo">
                        <label>Precio Base ($):*</label>
                        <input 
                            type="number" 
                            step="0.01"
                            name="precio_base" 
                            value={formData.precio_base} 
                            onChange={handleChange} 
                            placeholder="Ej: 30.50" 
                        />
                    </div>
                    <button type="submit" className="btn-guardar" style={{ marginTop: '10px' }}>
                        Guardar Servicio
                    </button>
                </form>
            </div>

            {loading ? (
                <div>Cargando servicios...</div>
            ) : (
                <table className="ordenes-tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Servicio</th>
                            <th>Tipo</th>
                            <th>Precio Base ($)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No hay servicios registrados</td>
                            </tr>
                        ) : (
                            servicios.map((servicio) => (
                                <tr key={servicio.id_servicio}>
                                    <td>{servicio.id_servicio}</td>
                                    <td>{servicio.nombre_servicio}</td>
                                    <td>{servicio.tipo_servicio || 'N/A'}</td>
                                    <td>{servicio.precio_base}</td>
                                    <td>
                                        <button className="btn-accion eliminar" onClick={() => handleEliminar(servicio.id_servicio)}>🗑 Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
