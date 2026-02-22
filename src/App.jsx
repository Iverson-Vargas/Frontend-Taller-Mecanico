import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import tailwindLogo from '../public/tailwind.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class= "flex flex-row justify-center gap-10 mb-5">
        <a href="https://vite.dev" target="_blank">
          <img class="w-30 h-30" src={viteLogo} alt="Vite logo" />
        </a>
        <a class="text-8xl">+</a>
        <a href="https://react.dev" target="_blank">
          <img class="w-30 h-30" src={reactLogo}  alt="React logo" />
        </a>
        <a class="text-8xl">+</a>
        <a href='https://tailwindcss.com/docs/installation/using-vite' target='_black'>
          <img class="w-30 h-30" src={tailwindLogo} alt="Tailwind logo" />
        </a>
      </div>

      <h1 class="mb-5">Este es el incio de nuestro proyecto de 5to semestre</h1>
      <h2 class=" text-3xl">El sistema es para un Taller mecanico</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          presiona para contar {count}
        </button>
        <p class="mt-5">
          Editar el archivo <code>src/App.jsx</code> para comenzar
        </p>
      </div>
      <p class="text-2xl">
        Desarroladores 👷‍♂️: 
          Iverson,
          Isis,
          Anthony, 
          Daviana, 
          Sebastian y
          Jose
      </p>
    </>
  )
}

export default App
