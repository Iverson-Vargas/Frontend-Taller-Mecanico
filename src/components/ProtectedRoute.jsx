import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    // Comprobar si hay una sesión activa en localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
        // Redirigir al usuario a la página de inicio de sesión si no está autenticado
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};
