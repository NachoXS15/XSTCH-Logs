import React from 'react'
import * as bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'
import Header from './components/Header'
import Logs from './pages/Logs'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Clients from './pages/Clients'
import Start from './pages/Start'
import CreateServices from './pages/services/CreateService'
import Services from './pages/services/Services'
import editService from './pages/services/editService'
import EditService from './pages/services/editService'
function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={<Start />} />
          //logs
          <Route path='/logs' element={<Logs />} />
          //clients
          <Route path='/clients' element={<Clients />} />
          //services
          <Route path='/services' element={<Services/>}/>
          <Route path='/services/serviceCreate' element={<CreateServices />} />
          <Route path='/services/editService/:id' element={<EditService />} />
        </Routes>
      </>
    </Router>
  )
}

export default App
