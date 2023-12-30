import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'

const BASE_URI = "http://localhost:3000/services/"

function EditService() {
    const [service, setService] = useState("")
    const navigate = useNavigate()
    const {id} = useParams()

    const updateService = async(e) => {
        try {
            e.preventDefault()
            await axios.put(BASE_URI+id, {
                nombre_servicio: service
            })
            navigate('/services')
            
        } catch (error) {
            console.log("error al actualizar: ", error.message)
        }
    }

    useEffect(() => {
        getOneService()
    }, [])

    const getOneService = async () => {
        try {
            const res = await axios.get(BASE_URI+id)
            setService(res.data.nombre_servicio)
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            <Header name="service"/>
            <Container>
                <h2>Actualizar servicio: {id}</h2>
                <form onSubmit={updateService}>
                    <input type="text" className='m-2' value={service} onChange={(e) => setService(e.target.value)} />
                    <button className='btn btn-primary m-2' >Actualizar</button>
                </form>
            </Container>

        </>
    )
}

export default EditService