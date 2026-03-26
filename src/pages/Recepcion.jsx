import '../assets/recepcion.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Recepcion = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        cedula_rif: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        kilometraje: ''
    });

    const handGenerarServicio = () => {
        navigate('/Prueba/Orden-Servicio');
    };
    
    const handListaClientes = () => {
        navigate('/Prueba/Listado-Clientes');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGuardar = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/clientes/recepcion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert('¡Registro exitoso!');
                setFormData({
                    cedula_rif: '', nombre: '', apellido: '', telefono: '', direccion: '',
                    placa: '', marca: '', modelo: '', ano: '', kilometraje: ''
                });
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className="container-formulario">
            <div className="botones-container">
                <button className="btn-1" onClick={handGenerarServicio}>Generar orden</button>
                <button className="btn-1" onClick={handListaClientes}>Listado de clientes</button>
            </div>
            
            <h2>Datos de Recepción</h2>

            <div className="formularios">
                <div className="form-cliente">
                    <h3>Datos del propietario</h3>

                    <div className="campo">
                        <label>Cédula o RIF:</label>
                        <input type="text" name="cedula_rif" value={formData.cedula_rif} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Nombre:</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Apellido:</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Teléfono:</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Dirección:</label>
                        <textarea name="direccion" value={formData.direccion} onChange={handleChange} rows="3"></textarea>
                    </div>
                </div>

                <div className="form-vehiculo">
                    <h3>Datos del Vehículo</h3>

                    <div className="campo">
                        <label>Placa:</label>
                        <input type="text" name="placa" value={formData.placa} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Marca:</label>
                        <input type="text" name="marca" value={formData.marca} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Modelo:</label>
                        <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Año:</label>
                        <input type="text" name="ano" value={formData.ano} onChange={handleChange} />
                    </div>

                    <div className="campo">
                        <label>Kilometraje:</label>
                        <input type="text" name="kilometraje" value={formData.kilometraje} onChange={handleChange} />
                    </div>

                    <div className="btn-vehiculo-container">
                        <button className="btn-anadir-vehiculo">
                            + Añadir otro vehículo
                        </button>
                    </div>
                </div>
            </div>

            <div className="botones-container">
                <button className="btn-1" onClick={handleGuardar}>Guardar Registro</button>
                <button className="btn-limpiar" onClick={() => setFormData({
                    cedula_rif: '', nombre: '', apellido: '', telefono: '', direccion: '',
                    placa: '', marca: '', modelo: '', ano: '', kilometraje: ''
                })}>Limpiar Formulario</button>
            </div>
        </div>
    );
};