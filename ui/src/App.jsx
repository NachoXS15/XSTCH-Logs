import React from 'react'
import './App.css'
import Header from './components/Header'
import Logs from './components/Logs'
import {Routes} from 'react-router-dom'
import { Route } from 'react-router'
import Clients from './components/Clients'
function App() {
  return (
    <>
      <Routes>
        <Route path='/logs' element={<Logs />} />
        <Route path='/clients' element={<Clients />} />
      </Routes> 

    </>
  )
}

export default App
