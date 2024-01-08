import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { Button } from 'react-bootstrap';

const BASE_URI = "http://localhost:3000/clients/"

function EditClient() {
  const [client, setClient] = useState("")
  const navigate = useNavigate();
  const { id } = useParams()


  const updateClient = async (e) => {
    try {
      e.preventDefault();
      axios.put(BASE_URI + id, {
        nombre_cliente: client
      })
      console.log("actualizado")
      navigate('/clients')
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getOneClient()
  }, [])

  const getOneClient = async () => {
    try {
      const res = await axios.get(BASE_URI + id)
      console.log(res.data)
      setClient(res.data.nombre_cliente);
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <Header />
      <h2>Actualizar cliente: {id}</h2>
      <form onSubmit={updateClient}>
        <input type="text" autoFocus value={client} onChange={(e) => setClient(e.target.value)} className='m-2' />
        <Button size='sm' className='buttonMain m-2'>Actualizar</Button>
      </form>
    </>
  )
}

export default EditClient