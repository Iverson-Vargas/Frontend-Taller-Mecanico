import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Direccionamiento } from './Direccionamiento.jsx'



function TallerApp() {
  return (
        <Router>
          <>
            <Direccionamiento/>
          </>
        </Router>
  )
}

export default TallerApp
