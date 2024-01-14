import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import axios from 'axios'
import { Button, Container } from 'react-bootstrap'
const BASE_URI_LOGS = "http://localhost:3000/logs/"
const BASE_URI_CLIENTS = "http://localhost:3000/clients/"
const BASE_URI_SERVICES = "http://localhost:3000/services/"
function CreateLog() {
  const [logs, setLogs] = useState({
    id_cliente: '',
    id_servicio: '',
    precio: '',
    estado: '',
    pago: '',
    egreso: ''
  })
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])

  const postLog = async(e) => {
    try {
      e.preventDefault();
      await axios.post(BASE_URI_LOGS, logs)
      console.log(logs)
      console.log("log creado")
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getAllServices(),
    getAllClients()
  }, [])

  const handleChange = (e) => {
    setLogs({...logs, [e.target.name]: e.target.value})
  }

  const getAllServices = async (req, res) => {
    try {
      const res = await axios.get(BASE_URI_SERVICES)
      setServices(res.data)
      console.log(services)
    } catch (error) {
      console.error("error al traer servicios: ", error.message)
    }
  }

  const getAllClients = async(req, res) => {
    try {
      const res = await axios.get(BASE_URI_CLIENTS)
      setClients(res.data)
      console.log(clients)
    } catch (error) {
      console.error("error al traer clientes: ", error.message)
    }
  }

  return (
    <>
      <Header path="logs"/>
      <h2>Crear registro</h2>
      <form className='' onSubmit={postLog}>
        <select name="id_cliente" onChange={handleChange} value={logs.id_cliente}>
          {
            clients.map(client => {
              return(
                <option value={client.id}>{client.nombre_cliente}</option>
              )
            })
          }
        </select>
        <select name="id_servicio" onChange={handleChange}>
          {
            services.map(service => {
              return(
                <option value={service.id}>{service.nombre_servicio}</option>
              )
            })
          }
        </select>
        <input type="date" name='egreso' value={logs.egreso} onChange={handleChange} placeholder='Fecha de egreso' />
        <input type="number" name='precio' placeholder='Ingrese monto' onChange={handleChange} value={logs.precio}/>
        <select name="estado" onChange={handleChange} value={logs.estado}>
          <option value="" disabled>Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Listo">Listo</option>
        </select>
        <select name="pago" onChange={handleChange} value={logs.pago}>
          <option value="" disabled>Pago</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Señado">Señado</option>
          <option value="Pagado">Pagado</option>
        </select>
        <Button type='submit' className='buttonMain mt-2'>Crear</Button>
      </form>
    </>
  )
}

export default CreateLog