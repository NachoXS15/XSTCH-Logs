import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BASE_URI_LOGS = "http://localhost:3000/logs/"
const BASE_URI_CLIENTS = "http://localhost:3000/clients/"
const BASE_URI_SERVICES = "http://localhost:3000/services/"

function EditLog() {
  const [log, setLog] = useState({
    id_cliente: '',
    id_servicio: '',
    precio: '',
    estado: '',
    pago: '',
    egreso: ''
  })
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const {id} = useParams()


  const updateLog = async(e) => {
    try {
      axios.put(BASE_URI_LOGS+id, log)
      console.log("log actualizado");
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getOneLog(),
    getAllServices(),
    getAllClients()
  }, [])

  const handleChange = (e) => {
    setLog({...log, [e.target.name]: e.target.value})
  }

  const getAllServices = async (req, res) => {
    try {
      const res = await axios.get(BASE_URI_SERVICES)
      setServices(res.data)
    } catch (error) {
      console.error("error al traer servicios: ", error.message)
    }
  }

  const getAllClients = async(req, res) => {
    try {
      const res = await axios.get(BASE_URI_CLIENTS)
      setClients(res.data)
    } catch (error) {
      console.error("error al traer clientes: ", error.message)
    }
  }
  
  const getOneLog = async() => {
    try {
      const res = await axios.get(BASE_URI_LOGS+id)
      setLog(res.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <Header path="logs" />
      <h2>Actualizar registro: {id}</h2>
      <form className='' onSubmit={updateLog}>
        <select name="id_cliente" onChange={handleChange} value={log.id_cliente}>
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
        <input type="date" name='egreso' value={log.egreso} onChange={handleChange} placeholder='Fecha de egreso' />
        <input type="number" name='precio' placeholder='Ingrese monto' onChange={handleChange} value={log.precio}/>
        <select name="estado" onChange={handleChange} value={log.estado}>
          <option value="" disabled>Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Listo">Listo</option>
        </select>
        <select name="pago" onChange={handleChange} value={log.pago}>
          <option value="" disabled>Pago</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Señado">Señado</option>
          <option value="Pagado">Pagado</option>
        </select>
        <Button type='submit' className='buttonMain mt-2'>Actualizar</Button>
      </form>
    </>
  )
}

export default EditLog