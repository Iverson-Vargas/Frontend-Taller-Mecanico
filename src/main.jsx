import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import TallerApp from './TallerApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <TallerApp />
    
  </StrictMode>,
)