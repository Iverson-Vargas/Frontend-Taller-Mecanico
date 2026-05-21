import React, { useState, useEffect } from 'react';
import api from '../services/axios.js';

export const Configuracion = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [feedback, setFeedback] = useState(null);
    
    // Estado de edición
    const [editMode, setEditMode] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    // Estado del formulario
    const [form, setForm] = useState({
        cedula_rif: '',
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        rol: 'user',
        permiso_recepcion: false,
        permiso_mecanico: false,
        permiso_admin_caja: false,
        permiso_inventario: false
    });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setCargando(true);
            const response = await api.get('/usuarios');
            const data = response.data.data;
            let usuariosArray = [];
            if (Array.isArray(data)) {
                usuariosArray = data;
            } else if (data && Array.isArray(data.usuarios)) {
                usuariosArray = data.usuarios;
            }
            setUsuarios(usuariosArray);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        } finally {
            setCargando(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleEditClick = (u) => {
        setEditMode(true);
        setSelectedUsuario(u.cedula_rif);
        setForm({
            cedula_rif: u.cedula_rif || '',
            nombre: u.nombre || '',
            apellido: u.apellido || '',
            correo: u.correo || '',
            contrasena: '********', // Contraseña oculta, no se modifica en este endpoint
            rol: u.rol || 'user',
            permiso_recepcion: u.permiso_recepcion || false,
            permiso_mecanico: u.permiso_mecanico || false,
            permiso_admin_caja: u.permiso_admin_caja || false,
            permiso_inventario: u.permiso_inventario || false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setSelectedUsuario(null);
        setForm({
            cedula_rif: '',
            nombre: '',
            apellido: '',
            correo: '',
            contrasena: '',
            rol: 'user',
            permiso_recepcion: false,
            permiso_mecanico: false,
            permiso_admin_caja: false,
            permiso_inventario: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);
        try {
            if (editMode) {
                // Modificar solo permisos
                await api.put(`/usuarios/${selectedUsuario}/permisos`, {
                    permiso_recepcion: form.permiso_recepcion,
                    permiso_mecanico: form.permiso_mecanico,
                    permiso_admin_caja: form.permiso_admin_caja,
                    permiso_inventario: form.permiso_inventario
                });
                setFeedback({ tipo: 'success', mensaje: 'Permisos modificados exitosamente.' });
            } else {
                // Crear usuario nuevo
                await api.post('/usuarios', form);
                setFeedback({ tipo: 'success', mensaje: 'Usuario creado exitosamente.' });
            }
            
            handleCancelEdit();
            fetchUsuarios();
        } catch (error) {
            const errorMsg = error.response?.data?.error || (editMode ? 'Error al modificar permisos.' : 'Error al crear el usuario.');
            setFeedback({ tipo: 'error', mensaje: errorMsg });
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-50 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl text-slate-800 font-extrabold m-0">
                        Configuración de <span className="text-[#F43F5E]">Usuarios</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">
                        Gestión de accesos, roles y permisos del sistema.
                    </p>
                </header>

                {feedback && (
                    <div className={`px-5 py-3 mb-6 rounded-xl border font-bold text-sm flex items-center gap-3 shadow-sm ${feedback.tipo === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {feedback.tipo === 'success' ? '✅' : '❌'} {feedback.mensaje}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: FORMULARIO */}
                    <div className="lg:col-span-1">
                        <div className={`bg-white p-6 rounded-3xl shadow-sm border sticky top-6 transition-all ${editMode ? 'border-amber-400 ring-4 ring-amber-100' : 'border-slate-200'}`}>
                            <h2 className={`text-lg font-bold mb-5 border-l-4 pl-3 ${editMode ? 'text-amber-600 border-amber-500' : 'text-slate-800 border-[#F43F5E]'}`}>
                                {editMode ? 'Modificar Permisos' : 'Registrar Nuevo Usuario'}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Cédula / RIF</label>
                                    <input required type="text" name="cedula_rif" value={form.cedula_rif} onChange={handleInputChange} disabled={editMode} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" placeholder="Ej: 12345678" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Nombre</label>
                                        <input required type="text" name="nombre" value={form.nombre} onChange={handleInputChange} disabled={editMode} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Apellido</label>
                                        <input type="text" name="apellido" value={form.apellido} onChange={handleInputChange} disabled={editMode} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Correo</label>
                                    <input required type="email" name="correo" value={form.correo} onChange={handleInputChange} disabled={editMode} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" placeholder="usuario@correo.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Contraseña</label>
                                    <input required type="password" name="contrasena" value={form.contrasena} onChange={handleInputChange} disabled={editMode} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" />
                                </div>
                                
                                <div className="border-t border-slate-100 pt-4 mt-2">
                                    <label className="block text-xs font-bold uppercase text-slate-800 mb-3">Rol y Permisos</label>
                                    
                                    <select name="rol" value={form.rol} onChange={handleInputChange} disabled={editMode} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] outline-none text-sm text-slate-800 mb-4 font-bold disabled:opacity-60 disabled:cursor-not-allowed">
                                        <option value="user">Usuario Básico (Empleado)</option>
                                        <option value="admin">Administrador Global</option>
                                    </select>

                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors ${form.permiso_recepcion ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                            <input type="checkbox" name="permiso_recepcion" checked={form.permiso_recepcion} onChange={handleInputChange} className="w-4 h-4 text-[#F43F5E] rounded border-slate-300 focus:ring-[#F43F5E]" />
                                            <span className="text-xs font-bold text-slate-600">Recepción</span>
                                        </label>
                                        <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors ${form.permiso_mecanico ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                            <input type="checkbox" name="permiso_mecanico" checked={form.permiso_mecanico} onChange={handleInputChange} className="w-4 h-4 text-[#F43F5E] rounded border-slate-300 focus:ring-[#F43F5E]" />
                                            <span className="text-xs font-bold text-slate-600">Mecánico</span>
                                        </label>
                                        <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors ${form.permiso_admin_caja ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                            <input type="checkbox" name="permiso_admin_caja" checked={form.permiso_admin_caja} onChange={handleInputChange} className="w-4 h-4 text-[#F43F5E] rounded border-slate-300 focus:ring-[#F43F5E]" />
                                            <span className="text-xs font-bold text-slate-600">Caja/Admin</span>
                                        </label>
                                        <label className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors ${form.permiso_inventario ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                            <input type="checkbox" name="permiso_inventario" checked={form.permiso_inventario} onChange={handleInputChange} className="w-4 h-4 text-[#F43F5E] rounded border-slate-300 focus:ring-[#F43F5E]" />
                                            <span className="text-xs font-bold text-slate-600">Inventario</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                    <button type="submit" className={`w-full font-bold py-3 rounded-xl shadow-md transition-all ${editMode ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
                                        {editMode ? 'Actualizar Permisos' : 'Guardar Usuario'}
                                    </button>
                                    {editMode && (
                                        <button type="button" onClick={handleCancelEdit} className="w-full font-bold py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                            Cancelar Edición
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: TABLA DE USUARIOS */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800 m-0 border-l-4 border-indigo-500 pl-3">
                                    Usuarios Registrados
                                </h2>
                                <button onClick={fetchUsuarios} className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2">
                                    ↻ Refrescar
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto p-0">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-200">
                                            <th className="text-left p-4 text-xs uppercase font-bold text-slate-500">Usuario</th>
                                            <th className="text-left p-4 text-xs uppercase font-bold text-slate-500">Rol</th>
                                            <th className="text-left p-4 text-xs uppercase font-bold text-slate-500">Permisos</th>
                                            <th className="text-center p-4 text-xs uppercase font-bold text-slate-500">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {cargando ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-bold">Cargando usuarios...</td></tr>
                                        ) : usuarios.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-slate-400 text-sm border-dashed border-2 m-4 rounded-xl">
                                                    No se encontraron usuarios o falta conectar.
                                                </td>
                                            </tr>
                                        ) : (
                                            usuarios.map(u => {
                                                const sinPermisos = !u.permiso_recepcion && !u.permiso_mecanico && !u.permiso_admin_caja && !u.permiso_inventario;
                                                return (
                                                <tr key={u.cedula_rif} className={`hover:bg-slate-50 transition-colors ${sinPermisos ? 'opacity-60 bg-slate-50/50' : ''}`}>
                                                    <td className="p-4">
                                                        <p className={`font-bold text-sm ${sinPermisos ? 'text-slate-500 line-through decoration-rose-400' : 'text-slate-800'}`}>
                                                            {u.nombre} {u.apellido}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{u.correo}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">V-{u.cedula_rif}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                                            {u.rol === 'admin' ? 'Admin' : 'User'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-1 flex-wrap max-w-[150px]">
                                                            {u.permiso_recepcion && <span className="w-2 h-2 rounded-full bg-blue-500" title="Recepción"></span>}
                                                            {u.permiso_mecanico && <span className="w-2 h-2 rounded-full bg-amber-500" title="Mecánico"></span>}
                                                            {u.permiso_admin_caja && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Caja"></span>}
                                                            {u.permiso_inventario && <span className="w-2 h-2 rounded-full bg-indigo-500" title="Inventario"></span>}
                                                            {sinPermisos && 
                                                                <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">BLOQUEADO</span>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button 
                                                            onClick={() => handleEditClick(u)}
                                                            className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 hover:text-amber-700 transition-colors border border-amber-200"
                                                        >
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            )})
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;
