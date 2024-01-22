import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../../components/Header'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
const BASE_URI = "http://localhost:3000/services/"

function CreateServices() {
    const [service, setService] = useState("")
    const navigator = useNavigate();

    const postService = async (e) => {
        try {
            e.preventDefault()
            await axios.post(BASE_URI, {nombre_servicio: service})
            navigator('/services')
        } catch (error) {
            console.error("fallo: ", error.message)
        }
    }
    return (
        <>
            <Header path="services" />
            <Container>
                <h2>Crear servicio:</h2>
                <form onSubmit={postService}>
                    <input type="text" autoFocus className='m-2' value={service} onChange={(e) => setService(e.target.value)} />
                    <button className='btn m-2 buttonMain'>Agregar</button>
                </form>
            </Container>
        </>
    )
}

export default CreateServices