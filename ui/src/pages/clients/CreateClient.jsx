import React, { useState } from 'react'
import Header from '../../components/Header'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BASE_URI = "http://localhost:3000/clients/"
function CreateClient() {
    const [client, setClient] = useState("")
    const navigate = useNavigate()

    const postClient = async(e) => {
        try {
            e.preventDefault();
            await axios.post(BASE_URI, {nombre_cliente: client})
            console.log("creado")
            navigate('/clients')
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <Header path="clients"/>
            <h2>Crear cliente:</h2>
            <form action="" onSubmit={postClient}>
                <input className='m-2' type="text" autoFocus value={client} onChange={(e) => setClient(e.target.value)}/>
                <button className='btn m-2 buttonMain'>Agregar</button>
            </form>
        </>
    )
}

export default CreateClient