import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
const BASE_URI = "http://localhost:3000/clients/"

function Clients() {
  const [clients, setClients] = useState([])
  useEffect(() => {
    getClients()
  }, [])


  const getClients = async (req, res) => {
    try {
      const res = await axios.get(BASE_URI)
      setClients(res.data)
    } catch (error) {
      console.log("error al traer datos: ", error.message)
    }
  }
  return (
    <>
      <Header create="client" />
      <div>
        <table border={1} className='w-100'>
          <tr>
            <th>Id</th>
            <th>Cliente</th>
          </tr>
          {clients.map((client) => {
            return (
              <tr key={client.id}>
                <td>{client.id_cliente}</td>
                <td>{client.nombre_cliente}</td>
              </tr>
            )
          })}
        </table>
      </div>
    </>
  )
}

export default Clients