import '../assets/recepcion.css';
import { useNavigate } from 'react-router-dom';

export const Recepcion = () => {
    const navigate = useNavigate();
    
    const handGenerarServicio = () => {
        navigate('/Prueba/Orden-Servicio');
    };
    
    const handListaClientes = () => {
        navigate('/Prueba/Listado-Clientes');
    };

    return (
        <div className="container-formulario">
            <div className="botones-container">
                <button className="btn-1" onClick={handGenerarServicio}>Generar orden</button>
                <button className="btn-1" onClick={handListaClientes}>Listado de clientes</button>
            </div>
            
            <h2>Datos de Recepción</h2>

            <div className="formularios">
                {/* FORMULARIO DE REGISTRO DE CLIENTE */}
                <div className="form-cliente">
                    <h3>Datos del propietario</h3>

                    <div className="campo">
                        <label htmlFor="cedula">Cédula:</label>
                        <input type="text" id="cedula" placeholder="123456789" />
                    </div>

                    <div className="campo">
                        <label htmlFor="nombre">Nombre y apellido:</label>
                        <input type="text" id="nombre" placeholder="Ingrese nombre y apellido" />
                    </div>

                    <div className="campo">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input type="text" id="telefono" placeholder="04123456789" />
                    </div>

                    <div className="campo">
                        <label htmlFor="direccion">Dirección:</label>
                        <input type="text" id="direccion" placeholder="Av. 1 entre calles 2 y 3" />
                    </div>

                    <div className="campo">
                        <label htmlFor="correo">Correo:</label>
                        <input type="text" id="correo" placeholder="ejemplo@gmail.com" />
                    </div>
                </div>

                {/* FORMULARIO DE REGISTRO DE VEHICULO */}
                <div className="form-cliente">
                    <h3>Datos del vehiculo</h3>

                    <div className="campo">
                        <label htmlFor="placa">Placa:</label>
                        <input type="text" id="placa" placeholder="AAA-32A" />
                    </div>

                    <div className="campo">
                        <label htmlFor="marca">Marca:</label>
                        <input type="text" id="marca" placeholder="Ingrese marca" />
                    </div>

                    <div className="campo">
                        <label htmlFor="modelo">Modelo:</label>
                        <input type="text" id="modelo" placeholder="Ingrese modelo" />
                    </div>

                    <div className="campo">
                        <label htmlFor="año">Año:</label>
                        <input type="text" id="año" placeholder="Ej: 2020" />
                    </div>

                    <div className="campo">
                        <label htmlFor="kilometraje">Kilometraje:</label>
                        <input type="text" id="kilometraje" placeholder="Ej. 50000" />
                    </div>

                    <div className="campo">
                        <label htmlFor="gasolina">Capacidad del tanque:</label>
                        <input type="text" id="gasolina" placeholder="Ej. 50" />
                    </div>

                    <div className="btn-vehiculo-container">
                        <button className="btn-anadir-vehiculo">
                            + Añadir otro vehículo
                        </button>
                    </div>
                </div>
            </div>

            <div className="botones-container">
                <button className="btn-1">Guardar Registro</button>
                <button className="btn-limpiar">Limpiar Formulario</button>
            </div>
        </div>
    );
};