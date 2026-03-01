import { Boton } from "../components/boton.jsx"

import { Link } from "react-router-dom"

export const Login = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="po text-2xl font-bold mb-4">Login</h1>
            <p className="">Esto es el login falta mejorarlo</p>
            <p className="mb-6">Posdata son las 4 de la mañana</p>
            
            {/* Le agregué unas clases de ejemplo al botón para que se vea mejor */}
            <button className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors">
                <Link to="/prueba/Recepcion">Ingresar</Link>
            </button>
        </div>
    )
}