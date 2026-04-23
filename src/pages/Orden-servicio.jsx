import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/orden-servicio.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const OrdenServicio = () => {
    const navigate = useNavigate();

    const [mecanicos, setMecanicos] = useState([]);
    
    const [form, setForm] = useState({
        placa_carro: '',
        id_mecanico: '',
        diagnostico_inicial: '',
        diagnostico_tecnico: '',
        estado: 'recepcion',
        prioridad: 'normal'
    });

    useEffect(() => {
        fetchMecanicos();
    }, []);

    const fetchMecanicos = async () => {
        try {
            const res = await fetch(`${API_URL}/empleados`);
            const data = await res.json();
            const arr = data.data?.empleados || data.data || [];
            setMecanicos(Array.isArray(arr) ? arr : []);
        } catch(err) {
            console.error("Error cargando mecanicos", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!form.placa_carro || !form.diagnostico_inicial) {
            alert('Placa y Diagnóstico Inicial son obligatorios');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/ordenes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                alert('Orden registrada correctamente');
                navigate('/panel/Lista-Servicio');
            } else {
                const errData = await response.json();
                alert(`Error al guardar: ${errData.message || 'Error desconocido'}`);
            }
        } catch(err) {
            console.error("Error al registrar orden", err);
            alert('Error de conexión al servidor');
        }
    };

    const handListaServicio = () => navigate('/panel/Lista-Servicio');
    const handListaClientes = () => navigate('/panel/Listado-Clientes');

    return (
        <form className="orden-container" onSubmit={handleSubmit}>
            <div className="botones">
                <button type="button" className="btn-2" onClick={handListaServicio}>
                    Listado de servicios
                </button>
                <button type="button" className="btn-2" onClick={handListaClientes}>
                    Listado de clientes
                </button>
            </div>

            <h1 className="titulo-principal">NUEVA ORDEN DE SERVICIO</h1>

            <div className="estado-mecanico mt-6">
                <div className="campo">
                    <label>Placa del Vehículo:</label>
                    <input 
                        type="text" 
                        name="placa_carro" 
                        value={form.placa_carro} 
                        onChange={handleChange} 
                        placeholder="Ej: ABC12D" 
                        required 
                        maxLength={15} 
                    />
                </div>
                <div className="campo">
                    <label>Estado de la orden:</label>
                    <select name="estado" value={form.estado} onChange={handleChange}>
                        <option value="recepcion">Recepción</option>
                        <option value="en_espera">En espera</option>
                        <option value="diagnostico">En diagnóstico</option>
                        <option value="espera_repuesto">Espera de repuesto</option>
                        <option value="reparacion">Reparación</option>
                        <option value="finalizada">Finalizada</option>
                    </select>
                </div>
                <div className="campo">
                    <label>Mecánico asignado:</label>
                    <select name="id_mecanico" value={form.id_mecanico} onChange={handleChange}>
                        <option value="">Seleccione un mecánico</option>
                        {mecanicos.map(m => (
                            <option key={m.id_empleado} value={m.id_empleado}>
                                {m.nombre} {m.apellido} - {m.cargo}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="campo">
                    <label>Prioridad:</label>
                    <select name="prioridad" value={form.prioridad} onChange={handleChange}>
                        <option value="baja">Baja</option>
                        <option value="normal">Normal</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                    </select>
                </div>
            </div>

            <h2 className="subtitulo">DIAGNÓSTICOS</h2>
            <div className="diagnostico-inicial">
                <div className="campo">
                    <label>Diagnóstico Inicial (Motivo de visita):</label>
                    <textarea 
                        rows="3" 
                        name="diagnostico_inicial" 
                        value={form.diagnostico_inicial} 
                        onChange={handleChange} 
                        required
                    ></textarea>
                </div>
            </div>

            <div className="diagnostico-tecnico mt-4">
                <div className="campo">
                    <label>Diagnóstico Técnico (Opcional):</label>
                    <textarea 
                        rows="3" 
                        name="diagnostico_tecnico" 
                        value={form.diagnostico_tecnico} 
                        onChange={handleChange}
                    ></textarea>
                </div>
            </div>

            <div className="botones-accion mt-8">
                <button type="submit" className="btn-guardar">Guardar Orden</button>
            </div>
        </form>
    );
};