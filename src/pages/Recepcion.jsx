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
        correo: '',
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        kilometraje: '',
        gasolina: ''
    });

    const handGenerarServicio = () => {
        navigate('/panel/Orden-Servicio');
    };
    
    const handListaClientes = () => {
        navigate('/panel/Listado-Clientes');
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
                    cedula_rif: '', nombre: '', apellido: '', telefono: '', direccion: '', correo: '',
                    placa: '', marca: '', modelo: '', ano: '', kilometraje: '', gasolina: ''
                });
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className="container-formulario" style={{ backgroundColor: '#F8FAFC', padding: '20px' }}>
             <div className="botones-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    className="btn-1" 
                    onClick={handGenerarServicio}
                    style={{ backgroundColor: '#1E293B', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    Generar orden
                </button>
                <button 
                    className="btn-1" 
                    onClick={handListaClientes}
                    style={{ backgroundColor: '#1E293B', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    Listado de clientes
                </button>
            </div>

            <h2 style={{ color: '#1E293B', fontWeight: 'bold', marginBottom: '20px' }}>Datos de Recepción</h2>

            <div className="formularios" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

                {/*FORMULARIO DE REGISTRO DE CLIENTE*/}
                <div className="form-cliente" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <h3 style={{ color: '#F43F5E', marginBottom: '15px' }}>Datos del propietario</h3>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Cédula o RIF:</label>
                        <input type="text" name="cedula_rif" value={formData.cedula_rif} onChange={handleChange} placeholder="123456789" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Nombre:</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ingrese nombre" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Apellido:</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ingrese apellido" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Teléfono:</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="04123456789" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Dirección:</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Av. 1 entre calles 2 y 3" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo">
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Correo:</label>
                        <input type="text" name="correo" value={formData.correo} onChange={handleChange} placeholder="ejemplo@gmail.com" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>
                </div>

                {/*FORMULARIO DE REGISTRO DE VEHICULO*/}
                <div className="form-cliente" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <h3 style={{ color: '#F43F5E', marginBottom: '15px' }}>Datos del vehiculo</h3>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Placa:</label>
                        <input type="text" name="placa" value={formData.placa} onChange={handleChange} placeholder="AAA-32A" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Marca:</label>
                        <input type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Ingrese marca" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Modelo:</label>
                        <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Ingrese modelo" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Año:</label>
                        <input type="text" name="ano" value={formData.ano} onChange={handleChange} placeholder="Ej: 2020" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Kilometraje:</label>
                        <input type="text" name="kilometraje" value={formData.kilometraje} onChange={handleChange} placeholder="Ej. 50000" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Capacidad del tanque:</label>
                        <input type="text" name="gasolina" value={formData.gasolina} onChange={handleChange} placeholder="Ej. 50" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="btn-vehiculo-container">
                        <button className="btn-anadir-vehiculo" style={{ background: 'none', border: 'none', color: '#F43F5E', fontWeight: 'bold', cursor: 'pointer' }}>
                            + Añadir otro vehículo
                        </button>
                    </div>
                </div>
            </div>

            {/*BOTONES PRINCIPALES*/}
            <div className="botones-container" style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
                <button 
                    onClick={handleGuardar}
                    className="btn-1" 
                    style={{ backgroundColor: '#10B981', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Guardar Registro
                </button>
                <button 
                    onClick={() => setFormData({
                        cedula_rif: '', nombre: '', apellido: '', telefono: '', direccion: '', correo: '',
                        placa: '', marca: '', modelo: '', ano: '', kilometraje: '', gasolina: ''
                    })}
                    className="btn-limpiar" 
                    style={{ backgroundColor: '#EF4444', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Limpiar Formulario
                </button>
            </div>
        </div>
    );
};