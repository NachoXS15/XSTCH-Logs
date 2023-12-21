import React from 'react'
import './App.css'
import Header from './components/Header'
import Logs from './pages/Logs'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Clients from './pages/Clients'
import Start from './pages/Start'
function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/logs' element={<Logs />} />
          <Route path='/clients' element={<Clients />} />
        </Routes>
      </>
    </Router>
  )
}

export default App
