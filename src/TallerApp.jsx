import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {Login} from './pages/Login.jsx'
import { Home } from './pages/Home.jsx';

function TallerApp() {


  return (
    <div>
        <Router>
          <div className='TallerApp'>
  
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Home" element={<Home />} />
              
            </Routes>
          </div>
        </Router>
    </div>
  )
}

export default TallerApp
