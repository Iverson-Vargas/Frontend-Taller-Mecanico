import { Boton } from "../components/boton.jsx"

import { Link } from "react-router-dom"

export const Login = () => {
    return (
        <>
            <h1>Login</h1>
            <p>Esto es el login</p>
            <button><Link to="/Recepcion">Ingre</Link></button>
        </>
    )
}