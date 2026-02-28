import { useNavigate } from 'react-router-dom';
import '../assets/orden-servicio.css';

export const OrdenServicio = () => {
    const navigate = useNavigate(); //importando funcion de navegacion

     const handListaServicio = () => {
            navigate('/Listado-servicios');
        };

    return (
        <div className="orden-container">
            {/* Botones*/}
            <div className="botones">
                <button className="btn-2" onClick={() => navigate('/Recepcion')}> ← Volver </button>
                <button className="btn-2" onClick={handListaServicio}> Listado de servicios </button>
            </div>

            <h1 className="titulo-principal">ORDEN DE SERVICIO</h1>


            <div className="encabezado-orden">
                <div className="numero-orden">
                    <label>N° de Orden:</label>
                    <input type="text" className="campo-lectura" />
                </div>
                <div className="fecha-hora">
                    <div className="campo">
                        <label>Fecha de ingreso:</label>
                        <input type="date" />
                    </div>
                    <div className="campo">
                        <label>Hora de ingreso:</label>
                        <input type="time" />
                    </div>
                </div>
            </div>

            {/* Estado y mecánico */}
            <div className="estado-mecanico">
                <div className="campo">
                    <label>Estado de la orden:</label>
                    <select>
                        <option value="">Seleccione</option>
                        <option>Activa</option>
                        <option>En espera</option>
                        <option>En diagnóstico</option>
                        <option>Espera de repuesto</option>
                        <option>Reparación</option>
                        <option>Finalizada</option>
                        <option>Entregada</option>
                    </select>
                </div>
                <div className="campo">
                    <label>Mecánico asignado:</label>
                    <select>
                        <option value="">Seleccione</option>
                        <option>Carlos Rodríguez</option>
                        <option>Juan Pérez</option>

                    </select>
                </div>
            </div>

            {/* Datos del Cliente */}
            <h2 className="subtitulo">DATOS DEL CLIENTE</h2>
            <div className="seccion-grid">
                <div className="campo">
                    <label>Cédula:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="text" />
                </div>
            </div>

            {/* Datos del Vehículo */}
            <h2 className="subtitulo">DATOS DEL VEHÍCULO</h2>
            <div className="seccion-grid">
                <div className="campo">
                    <label>Placa:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Marca:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Modelo:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Año:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Color:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Kilometraje actual:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Capacidad del tanque:</label>
                    <input type="text" />
                </div>
            </div>

            {/* Diagnóstico Inicial */}
            <h2 className="subtitulo">DIAGNÓSTICO INICIAL</h2>
            <div className="diagnostico-inicial">
                <div className="campo">
                    <label>Motivo de visita:</label>
                    <textarea rows="2"></textarea>
                </div>

                <h3 className="subtitulo-secundario">INVENTARIO INICIAL</h3>
                <div className="checkboxes-grid">
                    <div className="checkbox-item">
                        <input type="checkbox" id="caucho" />
                        <label htmlFor="caucho">¿Caucho de repuesto?</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="radio" />
                        <label htmlFor="radio">¿Radio?</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="herramientas" />
                        <label htmlFor="herramientas">¿Herramientas?</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="rayones" />
                        <label htmlFor="rayones">¿Rayones previos?</label>
                    </div>
                </div>

                <div className="campo">
                    <label>Falladas declaradas (descripción):</label>
                    <textarea rows="3"></textarea>
                </div>
            </div>

            {/* Diagnóstico Técnico */}
            <h2 className="subtitulo">DIAGNÓSTICO TÉCNICO</h2>
            <div className="diagnostico-tecnico">
                <div className="campo">
                    <label>Diagnóstico:</label>
                    <input type="text" />
                </div>
                <div className="campo">
                    <label>Observaciones:</label>
                    <textarea rows="3"></textarea>
                </div>
            </div>

            {/* Servicio */}
            <h2 className="subtitulo">SERVICIO</h2>
            <div className="servicio-grid">
                <div className="campo">
                    <label>Tipo de servicio:</label>
                    <select>
                        <option value="">Seleccione</option>
                        <option>Mantenimiento preventivo</option>
                        <option>Reparación mecánica</option>
                    </select>
                </div>
                <div className="campo">
                    <label>Categoría del servicio:</label>
                    <select>
                        <option value="">Seleccione</option>
                        <option>Sencillo</option>
                        <option>Pesado</option>
                    </select>
                </div>
            </div>

            {/* Repuestos */}
            <div className="repuestos-seccion">
                <div className="checkbox-item">
                    <input type="checkbox" id="repuesto" />
                    <label htmlFor="repuesto">¿Requiere repuesto?</label>
                </div>
                
                <div className="campo">
                    <label>Repuesto en inventario:</label>
                    <select>
                        <option value="">Seleccione un repuesto</option>
                        <option>Filtro de aceite</option>
                        <option>Pastillas de freno</option>
                    </select>
                </div>
            </div>

            {/* Costos */}
            <div className="costos-grid">
                <div className="campo">
                    <label>Costo ($):</label>
                    <input type="text" className="campo-lectura" readOnly />
                </div>
                
                <div className="mano-obra">
                    <div className="checkbox-item">
                        <input type="checkbox" id="manoObra" />
                        <label htmlFor="manoObra">¿Mano de obra especial?</label>
                    </div>
                    <div className="campo">
                        <label>Costo mano de obra ($):</label>
                        <input type="text" />
                    </div>
                </div>

                <div className="campo subtotal">
                    <label>Subtotal ($):</label>
                    <input type="text" className="campo-lectura campo-destacado" readOnly />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="botones-accion">
                <button className="btn-imprimir">Imprimir Orden</button>
                <button className="btn-guardar">Guardar Orden</button>
            </div>
        </div>
    );
};