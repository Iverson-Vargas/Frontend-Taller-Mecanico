import '../assets/recepcion.css';
import { useNavigate } from 'react-router-dom';

export const Recepcion = () => {
    const navigate = useNavigate();
    
    const handGenerarServicio = () => {
        navigate('/Orden-servicio');
    };
    const handListaClientes = () => {
        navigate('/Listado-clientes');
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
                <div className="form-cliente" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <h3 style={{ color: '#F43F5E', marginBottom: '15px' }}>Datos del propietario</h3>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="cedula" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Cédula:</label>
                        <input type="text" id="cedula" placeholder="123456789" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="nombre" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Nombre y apellido:</label>
                        <input type="text" id="nombre" placeholder="Ingrese nombre y apellido" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="telefono" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Teléfono:</label>
                        <input type="text" id="telefono" placeholder="04123456789" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="direccion" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Dirección:</label>
                        <input type="text" id="direccion" placeholder="Av. 1 entre calles 2 y 3" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo">
                        <label htmlFor="correo" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Correo:</label>
                        <input type="text" id="correo" placeholder="ejemplo@gmail.com" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>
                </div>

                {/*FORMULARIO DE REGISTRO DE VEHICULO*/}
                <div className="form-cliente" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <h3 style={{ color: '#F43F5E', marginBottom: '15px' }}>Datos del vehiculo</h3>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="placa" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Placa:</label>
                        <input type="text" id="placa" placeholder="AAA-32A" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="marca" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Marca:</label>
                        <input type="text" id="marca" placeholder="Ingrese marca" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="modelo" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Modelo:</label>
                        <input type="text" id="modelo" placeholder="Ingrese modelo" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="año" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Año:</label>
                        <input type="text" id="año" placeholder="Ej: 2020" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '10px' }}>
                        <label htmlFor="kilometraje" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Kilometraje:</label>
                        <input type="text" id="kilometraje" placeholder="Ej. 50000" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                    </div>

                    <div className="campo" style={{ marginBottom: '15px' }}>
                        <label htmlFor="gasolina" style={{ display: 'block', color: '#1E293B', fontSize: '14px', fontWeight: '600' }}>Capacidad del tanque:</label>
                        <input type="text" id="gasolina" placeholder="Ej. 50" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
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
                    className="btn-1" 
                    style={{ backgroundColor: '#10B981', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Guardar Registro
                </button>
                <button 
                    className="btn-limpiar" 
                    style={{ backgroundColor: '#EF4444', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Limpiar Formulario
                </button>
            </div>
        </div>
    );
};