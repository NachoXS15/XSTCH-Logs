import React from 'react'
import * as bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'
import Header from './components/Header'
import Logs from './pages/Logs'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Clients from './pages/Clients'
import Start from './pages/Start'
import CreateServices from './pages/services/CreateServices'
import Services from './pages/services/Services'
function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/logs' element={<Logs />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/services/serviceCreate' element={<CreateServices />} />
          <Route path='/services' element={<Services/>}/>
        </Routes>
      </>
    </Router>
  )
}

export default App
