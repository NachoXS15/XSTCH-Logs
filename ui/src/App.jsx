import React from 'react'
import * as bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'
import Header from './components/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import Logs from './pages/logs/Logs'
import CreateLog from './pages/logs/CreateLog'
import EditLog from './pages/logs/EditLog'
import Clients from './pages/clients/Clients'
import Services from './pages/services/Services'
import CreateServices from './pages/services/CreateService'
import EditService from './pages/services/editService'
import CreateClient from './pages/clients/CreateClient'
import EditClient from './pages/clients/EditClient'
function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={<Start />} />
          //logs
          <Route path='/logs' element={<Logs />} />
          <Route path='/logs/createLog' element={<CreateLog />} />
          <Route path='/logs/editLog/:id' element={<EditLog />} />
          //clients
          <Route path='/clients' element={<Clients />} />
          <Route path='/clients/createClient' element={<CreateClient />} />
          <Route path='/clients/editClient/:id' element={<EditClient />} />
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
