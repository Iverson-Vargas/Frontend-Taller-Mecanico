import { useState } from 'react';
import '../assets/recepcion.css';

export const RegistroVehiculo = () => {
    const [formData, setFormData] = useState({
        cedula_rif: '',
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        kilometraje: '',
        capacidad_tanque: ''
    });
    const [clienteEncontrado, setClienteEncontrado] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBuscarCliente = async () => {
        const cedula = formData.cedula_rif.trim();
        if (!cedula) {
            alert('Ingrese la cédula del cliente');
            return;
        }

        setCargando(true);
        try {
            const response = await fetch(`http://localhost:3001/api/clientes/consulta/${cedula}`);
            if (!response.ok) {
                throw new Error('Cliente no encontrado');
            }
            const data = await response.json();
            if (data.data) {
                setClienteEncontrado(data.data);
                alert(`Cliente encontrado: ${data.data.nombre} ${data.data.apellido}`);
            }
        } catch (error) {
            alert('Cliente no encontrado. Debe registrarlo primero.');
            setClienteEncontrado(null);
        } finally {
            setCargando(false);
        }
    };

    const normalizarPlaca = (placa) => {
        return placa.replace(/[-]/g, '').replace(/\s/g, '').toUpperCase();
    };

    const handleGuardar = async () => {
        if (!clienteEncontrado) {
            alert('Debe buscar un cliente existente primero');
            return;
        }
        if (!formData.placa) {
            alert('La placa es obligatoria');
            return;
        }

        setCargando(true);
        try {
            const placaNormalizada = normalizarPlaca(formData.placa);
            
            // Solo enviar los campos que existen en el modelo Carro
            const vehiculoData = {
                placa: placaNormalizada,
                marca: formData.marca || '',
                modelo: formData.modelo || '',
                ano: formData.ano ? parseInt(formData.ano) : null,
                kilometraje: formData.kilometraje ? parseInt(formData.kilometraje) : null,
                capacidad_tanque: formData.capacidad_tanque || '',
                id_cliente: clienteEncontrado.id_cliente  // ← Solo id_cliente, no cedula_rif
            };

            console.log('Datos a enviar:', vehiculoData);
            
            const response = await fetch('http://localhost:3001/api/carros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehiculoData)
            });
            const data = await response.json();
            console.log('Respuesta:', data);
            
            if (response.status === 201 || data.status === 201) {
                alert('Vehículo registrado exitosamente');
                setFormData({
                    cedula_rif: '',
                    placa: '',
                    marca: '',
                    modelo: '',
                    ano: '',
                    kilometraje: '',
                    capacidad_tanque: ''
                });
                setClienteEncontrado(null);
            } else {
                alert('Error: ' + (data?.message || 'No se pudo guardar'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el vehículo');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container-formulario">
            <div className="form-cliente" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3>Registro de Vehículo</h3>

                <div className="campo">
                    <label>Cédula del Cliente:*</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            name="cedula_rif" 
                            value={formData.cedula_rif} 
                            onChange={handleChange} 
                            placeholder="Ingrese cédula del cliente" 
                        />
                        <button 
                            className="btn-1" 
                            onClick={handleBuscarCliente} 
                            disabled={cargando}
                            style={{ margin: 0, whiteSpace: 'nowrap' }}
                        >
                            {cargando ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                {clienteEncontrado && (
                    <div className="campo">
                        <div style={{ backgroundColor: '#E0F2FE', padding: '10px', borderRadius: '6px', marginTop: '5px' }}>
                            <strong>Cliente:</strong> {clienteEncontrado.nombre} {clienteEncontrado.apellido}<br />
                            <strong>Teléfono:</strong> {clienteEncontrado.telefono}<br />
                            <strong>ID Cliente:</strong> {clienteEncontrado.id_cliente}
                        </div>
                    </div>
                )}

                <div className="campo">
                    <label>Placa:*</label>
                    <input 
                        type="text" 
                        name="placa" 
                        value={formData.placa} 
                        onChange={handleChange} 
                        placeholder="Ej: BBL32X" 
                    />
                </div>

                <div className="campo">
                    <label>Marca:</label>
                    <input 
                        type="text" 
                        name="marca" 
                        value={formData.marca} 
                        onChange={handleChange} 
                        placeholder="Ej: Renault" 
                    />
                </div>

                <div className="campo">
                    <label>Modelo:</label>
                    <input 
                        type="text" 
                        name="modelo" 
                        value={formData.modelo} 
                        onChange={handleChange} 
                        placeholder="Ej: Celio" 
                    />
                </div>

                <div className="campo">
                    <label>Año:</label>
                    <input 
                        type="number" 
                        name="ano" 
                        value={formData.ano} 
                        onChange={handleChange} 
                        placeholder="Ej: 2015" 
                    />
                </div>

                <div className="campo">
                    <label>Kilometraje:</label>
                    <input 
                        type="number" 
                        name="kilometraje" 
                        value={formData.kilometraje} 
                        onChange={handleChange} 
                        placeholder="Ej: 1000" 
                    />
                </div>

                <div className="campo">
                    <label>Capacidad del tanque:</label>
                    <input 
                        type="text" 
                        name="capacidad_tanque" 
                        value={formData.capacidad_tanque} 
                        onChange={handleChange} 
                        placeholder="Ej: 20 litros" 
                    />
                </div>

                <div className="botones-container" style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <button 
                        className="btn-guardar" 
                        onClick={handleGuardar} 
                        disabled={cargando || !clienteEncontrado}
                    >
                        {cargando ? 'Guardando...' : 'Registrar Vehículo'}
                    </button>
                </div>
            </div>
        </div>
    );
};
