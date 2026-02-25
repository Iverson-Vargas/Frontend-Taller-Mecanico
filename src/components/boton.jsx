import './boton.css'
export function Boton() {

    const saludar = () =>{
        alert('Hola')
    }
    return(
        <button className="button" onClick={saludar}>
            Enviar
        </button>
    )
}
