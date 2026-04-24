import api from './axios.js';

export const clienteService = {
    getAll: async () => {
        try {
            const response = await api.get('/clientes');
            return response.data;
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/clientes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            throw error;
        }
    },

    create: async (clienteData) => {
        try {
            const response = await api.post('/clientes', clienteData);
            return response.data;
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }
    },

    update: async (id, clienteData) => {
        try {
            console.log(`Actualizando cliente ID: ${id}`, clienteData);
            const response = await api.put(`/clientes/${id}`, clienteData);
            console.log('Respuesta update:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            console.error('Detalles del error:', error.response?.data);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/clientes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            throw error;
        }
    },

    createRecepcion: async (formData) => {
        try {
            const response = await api.post('/clientes/recepcion', formData);
            return response.data;
        } catch (error) {
            console.error('Error al crear recepción:', error);
            throw error;
        }
    },

    consultarEstado: async (cedula) => {
        try {
            const response = await api.get(`/clientes/consulta/${cedula}`);
            return response.data;
        } catch (error) {
            console.error('Error al consultar estado:', error);
            throw error;
        }
    }
};

// ========== SERVICIO DE ÓRDENES (AGREGADO) ==========
export const ordenService = {
    // Obtener todas las órdenes
    getAll: async () => {
        try {
            const response = await api.get('/ordenes');
            return response.data;
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
            throw error;
        }
    },

    // Obtener orden por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/ordenes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener orden:', error);
            throw error;
        }
    },

    // Crear nueva orden
    create: async (ordenData) => {
        try {
            const response = await api.post('/ordenes', ordenData);
            return response.data;
        } catch (error) {
            console.error('Error al crear orden:', error);
            throw error;
        }
    },

    // Actualizar orden
    update: async (id, ordenData) => {
        try {
            const response = await api.put(`/ordenes/${id}`, ordenData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar orden:', error);
            throw error;
        }
    },

    // Eliminar orden
    delete: async (id) => {
        try {
            const response = await api.delete(`/ordenes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar orden:', error);
            throw error;
        }
    },

    // Obtener órdenes finalizadas
    getFinalizadas: async () => {
        try {
            const response = await api.get('/ordenes/finalizadas');
            return response.data;
        } catch (error) {
            console.error('Error al obtener órdenes finalizadas:', error);
            throw error;
        }
    }
};

export default clienteService;